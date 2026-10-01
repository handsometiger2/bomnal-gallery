import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { ApartmentProject } from '../types';
import { INITIAL_PORTFOLIOS } from '../data/mockPortfolios';

const COLLECTION_NAME = 'apartments';

/**
 * Fetch all apartment projects from Firestore.
 * If database is empty, seed with INITIAL_PORTFOLIOS.
 */
export async function loadApartmentsFromFirestore(): Promise<ApartmentProject[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as ApartmentProject);
      // 만약 이전 서울 예시 아파트(예: 반포 래미안 원베일리)가 여전히 클라우드에 남아있다면 새 명칭 리스트로 자동 갱신
      const hasOldApt = items.some((p) => p.complexName.includes('반포') || p.complexName.includes('마포 래미안'));
      if (hasOldApt) {
        console.log('Migrating Firestore apartments to Daegu Wolseong/Wolbae portfolios...');
        await syncAllApartmentsToFirestore(INITIAL_PORTFOLIOS);
        return INITIAL_PORTFOLIOS;
      }
      return items;
    }

    // Seed default projects if firestore is empty
    console.log('Seeding initial apartments to Firestore...');
    const batch = writeBatch(db);
    for (const proj of INITIAL_PORTFOLIOS) {
      const docRef = doc(db, COLLECTION_NAME, proj.id);
      batch.set(docRef, proj);
    }
    await batch.commit();
    return INITIAL_PORTFOLIOS;
  } catch (error) {
    console.error('Failed to load from Firestore, falling back to local data:', error);
    return INITIAL_PORTFOLIOS;
  }
}

/**
 * Save / Update a single apartment project in Firestore
 */
export async function saveApartmentToFirestore(project: ApartmentProject): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, project.id);
    await setDoc(docRef, project, { merge: true });
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
    const docRef = doc(db, COLLECTION_NAME, projectId);
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
    // Get existing ids to clean up removed ones
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    const currentIds = new Set(projects.map((p) => p.id));

    const batch = writeBatch(db);

    // Delete items removed from UI
    snap.docs.forEach((d) => {
      if (!currentIds.has(d.id)) {
        batch.delete(d.ref);
      }
    });

    // Set updated items
    projects.forEach((p) => {
      const docRef = doc(db, COLLECTION_NAME, p.id);
      batch.set(docRef, p);
    });

    await batch.commit();
  } catch (error) {
    console.error('Failed to sync all apartments to Firestore:', error);
    throw error;
  }
}
