import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './client';

export interface FirebaseSaveData {
  highScore: number;
  highestLevel: number;
  stars: number;
  updatedAt?: string;
}

/**
 * Saves game progress to Firestore
 */
export async function syncProgressToFirebase(userId: string, data: FirebaseSaveData): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'user_profiles', userId);
    await setDoc(
      userDocRef,
      {
        userId,
        highScore: data.highScore,
        highestLevel: data.highestLevel,
        stars: data.stars,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Firebase save error:', err);
    return false;
  }
}

/**
 * Loads game progress from Firestore
 */
export async function fetchProgressFromFirebase(userId: string): Promise<FirebaseSaveData | null> {
  try {
    const userDocRef = doc(db, 'user_profiles', userId);
    const snapshot = await getDoc(userDocRef);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      highScore: data.highScore ?? 0,
      highestLevel: data.highestLevel ?? 1,
      stars: data.stars ?? 0,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
    console.warn('Firebase fetch error:', err);
    return null;
  }
}
