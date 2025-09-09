'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(ref: CollectionReference<T> | Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
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
        const docs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setData(docs as T[]);
        setLoading(false);
      },
      async (error) => {
        const path = ref instanceof CollectionReference ? ref.path : 'query';
        const permissionError = new FirestorePermissionError({ path, operation: 'list' });
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
