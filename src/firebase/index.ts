'use client';
import { useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, DocumentReference, Query } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Export the hooks and providers from the other files
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useFirebase, useFirebaseApp, useFirestore, useAuth, FirebaseProvider } from './provider';
export { errorEmitter } from './error-emitter';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (typeof window === 'undefined') {
    // This should never be called on the server, but as a safeguard:
    throw new Error("Firebase should only be initialized on the client.");
  }
  
  if (firebaseInstances) {
    return firebaseInstances;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}

export function useMemoFirebase<T extends DocumentReference | Query | null>(
  factory: () => T,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo<T>(factory, deps);
  return ref;
}
