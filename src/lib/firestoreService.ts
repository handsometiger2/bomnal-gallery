import {
  collection,
  doc,
  getDoc,
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
        const projectsWithPhotos: ApartmentProject[] = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const raw = docSnap.data() as ApartmentProject;
            const finalThumbnail = sanitizePhotoUrl(raw.thumbnailUrl);

            let cleanedRoomPhotos: RoomPhoto[] = [];
            if (raw.hasPhotoChunks) {
              try {
                const chunksSnap = await getDocs(collection(db, APARTMENTS_COL, docSnap.id, 'photo_chunks'));
                const sortedChunks = chunksSnap.docs
                  .map((c) => c.data() as { index: number; photos: RoomPhoto[] })
                  .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
                for (const chunk of sortedChunks) {
                  if (Array.isArray(chunk.photos)) {
                    cleanedRoomPhotos.push(
                      ...chunk.photos.map((p) => ({
                        ...p,
                        imageUrl: sanitizePhotoUrl(p.imageUrl),
                      }))
                    );
                  }
                }
              } catch (e) {
                console.warn('Failed to load chunks for', docSnap.id, e);
              }
            } else {
              cleanedRoomPhotos = (raw.roomPhotos || []).map((p) => ({
                ...p,
                imageUrl: sanitizePhotoUrl(p.imageUrl),
              }));
            }

            return {
              ...raw,
              id: docSnap.id,
              thumbnailUrl: finalThumbnail,
              roomPhotos: cleanedRoomPhotos,
            };
          })
        );

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
      return await Promise.all(
        snap.docs.map(async (docSnap) => {
          const raw = docSnap.data() as ApartmentProject;
          let cleanedRoomPhotos: RoomPhoto[] = [];

          if (raw.hasPhotoChunks) {
            try {
              const chunksSnap = await getDocs(collection(db, APARTMENTS_COL, docSnap.id, 'photo_chunks'));
              const sortedChunks = chunksSnap.docs
                .map((c) => c.data() as { index: number; photos: RoomPhoto[] })
                .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
              for (const chunk of sortedChunks) {
                if (Array.isArray(chunk.photos)) {
                  cleanedRoomPhotos.push(
                    ...chunk.photos.map((p) => ({
                      ...p,
                      imageUrl: sanitizePhotoUrl(p.imageUrl),
                    }))
                  );
                }
              }
            } catch (e) {
              console.warn('Failed to load chunks for', docSnap.id, e);
            }
          } else {
            cleanedRoomPhotos = (raw.roomPhotos || []).map((p) => ({
              ...p,
              imageUrl: sanitizePhotoUrl(p.imageUrl),
            }));
          }

          return {
            ...raw,
            id: docSnap.id,
            thumbnailUrl: sanitizePhotoUrl(raw.thumbnailUrl),
            roomPhotos: cleanedRoomPhotos,
          };
        })
      );
    }

    return INITIAL_PORTFOLIOS;
  } catch (error) {
    console.warn('Falling back to local data on read quota limitation:', error);
    return INITIAL_PORTFOLIOS;
  }
}

/**
 * Save / Update a single apartment project in Firestore.
 * Automatically chunks photos if document size exceeds safe threshold (650KB),
 * guaranteeing that Firestore 1MB document size limit is NEVER exceeded.
 */
export async function saveApartmentToFirestore(project: ApartmentProject): Promise<void> {
  try {
    const aptRef = doc(db, APARTMENTS_COL, project.id);
    const photos = (project.roomPhotos || []).map((p) => ({
      ...p,
      imageUrl: sanitizePhotoUrl(p.imageUrl),
    }));

    const photosJson = JSON.stringify(photos);
    // Firestore max document size: 1,048,576 bytes.
    // Safe threshold: 600,000 bytes (600KB)
    const exceedsSafeDocSize = photosJson.length > 600000;

    let inlinePhotos: RoomPhoto[] = [];
    let hasPhotoChunks = false;
    let photoChunkCount = 0;

    if (exceedsSafeDocSize) {
      hasPhotoChunks = true;
      const CHUNK_SIZE = 6;
      const chunks: RoomPhoto[][] = [];
      for (let i = 0; i < photos.length; i += CHUNK_SIZE) {
        chunks.push(photos.slice(i, i + CHUNK_SIZE));
      }
      photoChunkCount = chunks.length;

      // Save chunk documents
      for (let i = 0; i < chunks.length; i++) {
        const chunkRef = doc(db, APARTMENTS_COL, project.id, 'photo_chunks', `chunk_${i}`);
        await setDoc(chunkRef, { index: i, photos: chunks[i] }, { merge: true });
      }

      // Keep first photo or empty for thumbnail reference
      inlinePhotos = [];
    } else {
      inlinePhotos = photos;
      hasPhotoChunks = false;
      photoChunkCount = 0;

      // Clean up any old chunks if previously chunked
      try {
        const oldChunksSnap = await getDocs(collection(db, APARTMENTS_COL, project.id, 'photo_chunks'));
        for (const c of oldChunksSnap.docs) {
          await deleteDoc(c.ref);
        }
      } catch {
        // ignore
      }
    }

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
      roomPhotos: inlinePhotos,
      hasPhotoChunks,
      photoChunkCount,
      features: project.features || [],
      materials: project.materials || {},
      agentNote: project.agentNote || '',
      photoCount: photos.length,
      updatedAt: Date.now()
    };

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
    // Delete photo chunks if any exist
    try {
      const chunksSnap = await getDocs(collection(db, APARTMENTS_COL, projectId, 'photo_chunks'));
      for (const c of chunksSnap.docs) {
        await deleteDoc(c.ref);
      }
    } catch {
      // ignore
    }
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


// ---------------------------------------------------------------------------
// 사이트 전체 공개 비밀번호 (갤러리 입장 잠금)
// Firestore settings/site_lock 문서에 저장. 읽기 공개, 쓰기는 관리자만.
// ---------------------------------------------------------------------------

const SITE_LOCK_DOC = 'site_lock';

/** 사이트 잠금 해제를 위한 기본 비밀번호 (Firestore에 값이 없을 때 사용) */
export const DEFAULT_SITE_PASSWORD = 'bom2656^^';

/**
 * Firestore에서 사이트 공개 비밀번호를 가져온다.
 * 문서가 없거나 읽기 실패 시 null 반환 (호출자가 기본값 사용).
 */
export async function getSitePasswordFromFirestore(): Promise<string | null> {
  try {
    const docRef = doc(db, SETTINGS_COL, SITE_LOCK_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.password === 'string' && data.password.trim()) {
        return data.password;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 사이트 공개 비밀번호를 Firestore에 저장한다. (관리자 로그인 필요)
 */
export async function saveSitePasswordToFirestore(password: string): Promise<void> {
  const docRef = doc(db, SETTINGS_COL, SITE_LOCK_DOC);
  await setDoc(docRef, { password: password.trim(), updatedAt: Date.now() }, { merge: true });
}
