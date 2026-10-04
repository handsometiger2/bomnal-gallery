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

export const BANNED_WOOD_HOUSE_PHOTO = 'photo-1600585154340-be6161a56a0c';
export const REPLACEMENT_INTERIOR_PHOTO = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';

export function sanitizePhotoUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.includes(BANNED_WOOD_HOUSE_PHOTO)) {
    return REPLACEMENT_INTERIOR_PHOTO;
  }
  return url;
}

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
        // Direct read from documents - ZERO additional subcollection queries, ultra-low quota consumption
        const projectsWithPhotos: ApartmentProject[] = snap.docs.map((docSnap) => {
          const raw = docSnap.data() as ApartmentProject;
          const finalThumbnail = sanitizePhotoUrl(raw.thumbnailUrl);
          const cleanedRoomPhotos: RoomPhoto[] = (raw.roomPhotos || []).map((p) => ({
            ...p,
            imageUrl: sanitizePhotoUrl(p.imageUrl),
          }));

          return {
            ...raw,
            id: docSnap.id,
            thumbnailUrl: finalThumbnail,
            roomPhotos: cleanedRoomPhotos,
          };
        });

        onData(projectsWithPhotos);
      } catch (err) {
        console.error('Error constructing projects with photos:', err);
        const fallback = snap.docs.map((d) => {
          const raw = d.data() as ApartmentProject;
          return {
            ...raw,
            thumbnailUrl: sanitizePhotoUrl(raw.thumbnailUrl),
            roomPhotos: (raw.roomPhotos || []).map((p) => ({
              ...p,
              imageUrl: sanitizePhotoUrl(p.imageUrl),
            })),
          };
        });
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
      return snap.docs.map((docSnap) => {
        const raw = docSnap.data() as ApartmentProject;
        return {
          ...raw,
          id: docSnap.id,
          thumbnailUrl: sanitizePhotoUrl(raw.thumbnailUrl),
          roomPhotos: (raw.roomPhotos || []).map((p) => ({
            ...p,
            imageUrl: sanitizePhotoUrl(p.imageUrl),
          })),
        };
      });
    }

    return INITIAL_PORTFOLIOS;
  } catch (error) {
    console.warn('Falling back to local data on read quota limitation:', error);
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
    const photos = (project.roomPhotos || []).map((p) => ({
      ...p,
      imageUrl: sanitizePhotoUrl(p.imageUrl),
    }));

    // 1. Save directly to main apartment document without ANY preceding getDocs reads
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
      thumbnailUrl: sanitizePhotoUrl(project.thumbnailUrl) || (photos[0]?.imageUrl || ''),
      roomPhotos: photos, // 루트 문서에 고화질 사진 배열 바로 저장
      features: project.features || [],
      materials: project.materials || {},
      agentNote: project.agentNote || '',
      photoCount: photos.length,
      updatedAt: Date.now()
    };

    // Single write operation with merge: true - zero read quota consumed!
    await setDoc(aptRef, baseProjectDoc, { merge: true });
  } catch (error) {
    console.error('Failed to save apartment to Firestore:', error);
    throw error;
  }
}

/**
 * Delete an apartment project from Firestore
 */
export async function deleteApartmentFromFirestore(projectId: string): Promise<void> {
  try {
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
const AUTH_SETTINGS_DOC = 'auth';

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

/**
 * Save Admin Password to Firestore Cloud so it never resets to 'admin'
 */
export async function saveAdminPasswordToFirestore(password: string): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COL, AUTH_SETTINGS_DOC);
    await setDoc(docRef, { adminPassword: password, updatedAt: Date.now() }, { merge: true });
  } catch (error) {
    console.error('Failed to save admin password to Firestore:', error);
    throw error;
  }
}

/**
 * Real-time subscribe to Admin Password from Firestore Cloud
 */
export function subscribeAdminPasswordFromFirestore(
  onData: (password: string) => void,
  onError?: (err: unknown) => void
): () => void {
  const docRef = doc(db, SETTINGS_COL, AUTH_SETTINGS_DOC);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && typeof data.adminPassword === 'string' && data.adminPassword.trim()) {
          onData(data.adminPassword.trim());
        }
      }
    },
    onError
  );
}

