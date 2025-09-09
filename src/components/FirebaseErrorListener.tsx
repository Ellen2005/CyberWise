'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      if (process.env.NODE_ENV === 'development') {
        // In development, we want to see the Next.js error overlay
        throw error;
      } else {
        // In production, you might want to log to a service
        console.error(error);
      }
    };

    errorEmitter.on('permission-error', handleError);

    // In a real app with HMR, you might need to clean up the listener
    return () => {
        errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
