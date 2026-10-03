import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { ApartmentProject, RoomPhoto } from '../types';
import { INITIAL_PORTFOLIOS } from '../data/mockPortfolios';

const APARTMENTS_COL = 'apartments';
const PHOTOS_SUBCOL = 'photos';

/**
 * Real-time listener for apartments and their photos
 */
export function subscribeApartmentsFromFirestore(
  onData: (projects: ApartmentProject[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const colRef = collection(db, APARTMENTS_COL);

  return onSnapshot(
    colRef,
    async (snap) => {
      if (snap.empty) {
        // Seed initial apartments if collection is completely empty
        console.log('Seeding initial apartments to Firestore...');
        try {
          await syncAllApartmentsToFirestore(INITIAL_PORTFOLIOS);
          onData(INITIAL_PORTFOLIOS);
        } catch (e) {
          console.error('Failed to seed firestore:', e);
          onData(INITIAL_PORTFOLIOS);
        }
        return;
      }

      try {
        // Load each apartment with its photos (supports both subcollection and legacy inline)
        const projectsWithPhotos: ApartmentProject[] = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const raw = docSnap.data() as ApartmentProject;
            try {
              const photoSubSnap = await getDocs(collection(db, APARTMENTS_COL, docSnap.id, PHOTOS_SUBCOL));
              if (!photoSubSnap.empty) {
                const subPhotos = photoSubSnap.docs
                  .map((pDoc) => pDoc.data() as RoomPhoto & { order?: number })
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                return {
                  ...raw,
                  roomPhotos: subPhotos,
                };
              }
            } catch (err) {
              console.warn('Error reading photo subcollection, fallback to inline photos:', err);
            }
            return raw;
          })
        );

        onData(projectsWithPhotos);
      } catch (err) {
        console.error('Error constructing projects with photos:', err);
        const fallback = snap.docs.map((d) => d.data() as ApartmentProject);
        onData(fallback);
      }
    },
    (err) => {
      console.error('Firestore onSnapshot error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch all apartment projects from Firestore.
 */
export async function loadApartmentsFromFirestore(): Promise<ApartmentProject[]> {
  try {
    const colRef = collection(db, APARTMENTS_COL);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const projects = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const raw = docSnap.data() as ApartmentProject;
          try {
            const photoSubSnap = await getDocs(collection(db, APARTMENTS_COL, docSnap.id, PHOTOS_SUBCOL));
            if (!photoSubSnap.empty) {
              const subPhotos = photoSubSnap.docs
                .map((pDoc) => pDoc.data() as RoomPhoto & { order?: number })
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              return {
                ...raw,
                roomPhotos: subPhotos,
              };
            }
          } catch {
            // fallback
          }
          return raw;
        })
      );
      return projects;
    }

    // Seed default projects
    console.log('Seeding initial apartments to Firestore...');
    await syncAllApartmentsToFirestore(INITIAL_PORTFOLIOS);
    return INITIAL_PORTFOLIOS;
  } catch (error) {
    console.error('Failed to load from Firestore, falling back to local data:', error);
    return INITIAL_PORTFOLIOS;
  }
}

/**
 * Save / Update a single apartment project in Firestore.
 * Stores individual photos as subcollection documents so 1MB document limit is NEVER exceeded,
 * regardless of how many high-resolution photos are uploaded.
 */
export async function saveApartmentToFirestore(project: ApartmentProject): Promise<void> {
  try {
    const aptRef = doc(db, APARTMENTS_COL, project.id);
    const photos = project.roomPhotos || [];

    // 1. Save main apartment document (without the giant array of photos)
    const baseProjectDoc = {
      id: project.id,
      complexName: project.complexName || '',
      subTitle: project.subTitle || '',
      address: project.address || '',
      pyeong: project.pyeong || 0,
      squareMeters: project.squareMeters || 0,
      style: project.style || '모던 미니멀',
      costMillionWon: project.costMillionWon || 0,
      durationWeeks: project.durationWeeks || 4,
      completionDate: project.completionDate || '2026',
      thumbnailUrl: project.thumbnailUrl || (photos[0]?.imageUrl || ''),
      features: project.features || [],
      materials: project.materials || {},
      agentNote: project.agentNote || '',
      photoCount: photos.length,
      updatedAt: Date.now()
    };

    await setDoc(aptRef, baseProjectDoc, { merge: true });

    // 2. Clear old photo documents in subcollection and save new ones
    const photoColRef = collection(db, APARTMENTS_COL, project.id, PHOTOS_SUBCOL);
    const existingPhotoSnap = await getDocs(photoColRef);
    
    // Batch delete existing
    if (!existingPhotoSnap.empty) {
      const deleteBatch = writeBatch(db);
      existingPhotoSnap.docs.forEach((d) => deleteBatch.delete(d.ref));
      await deleteBatch.commit();
    }

    // Save photos sequentially or in chunked batches (Firestore limits 500 per batch)
    if (photos.length > 0) {
      const photoBatch = writeBatch(db);
      photos.forEach((photo, idx) => {
        const pRef = doc(photoColRef, photo.id || `p-${idx}`);
        photoBatch.set(pRef, {
          ...photo,
          order: idx
        });
      });
      await photoBatch.commit();
    }
  } catch (error) {
    console.error('Failed to save apartment to Firestore:', error);
    throw error;
  }
}

/**
 * Delete an apartment project and its photos from Firestore
 */
export async function deleteApartmentFromFirestore(projectId: string): Promise<void> {
  try {
    const photoColRef = collection(db, APARTMENTS_COL, projectId, PHOTOS_SUBCOL);
    const existingPhotoSnap = await getDocs(photoColRef);
    if (!existingPhotoSnap.empty) {
      const deleteBatch = writeBatch(db);
      existingPhotoSnap.docs.forEach((d) => deleteBatch.delete(d.ref));
      await deleteBatch.commit();
    }

    const docRef = doc(db, APARTMENTS_COL, projectId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete apartment from Firestore:', error);
    throw error;
  }
}

/**
 * Sync entire list to Firestore
 */
export async function syncAllApartmentsToFirestore(projects: ApartmentProject[]): Promise<void> {
  try {
    for (const proj of projects) {
      await saveApartmentToFirestore(proj);
    }
  } catch (error) {
    console.error('Failed to sync all apartments to Firestore:', error);
    throw error;
  }
}

const SETTINGS_COL = 'settings';
const MAIN_PAGE_DOC = 'main_page';

export async function saveMainImageToFirestore(imageUrl: string): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COL, MAIN_PAGE_DOC);
    await setDoc(docRef, { mainImageUrl: imageUrl, updatedAt: Date.now() }, { merge: true });
  } catch (error) {
    console.error('Failed to save main image to Firestore:', error);
    throw error;
  }
}

export function subscribeMainImageFromFirestore(
  onData: (url: string) => void,
  onError?: (err: unknown) => void
): () => void {
  const docRef = doc(db, SETTINGS_COL, MAIN_PAGE_DOC);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.mainImageUrl) {
          onData(data.mainImageUrl);
        }
      }
    },
    onError
  );
}

