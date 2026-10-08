import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Server-only Firestore access (bypasses security rules).
 * Requires FIREBASE_SERVICE_ACCOUNT_JSON env (service account JSON, one line).
 * Never import this file from client components.
 */
export function adminDb() {
  if (getApps().length === 0) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Create a service account key in the Firebase console and add it to the server environment.'
      );
    }
    initializeApp({
      credential: cert(JSON.parse(raw)),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return getFirestore();
}
