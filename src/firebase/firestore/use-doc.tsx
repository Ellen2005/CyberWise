'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc, DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (error) => {
        const permissionError = new FirestorePermissionError({ path: ref.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        console.error(permissionError); // Also log it
        setLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading };
}
