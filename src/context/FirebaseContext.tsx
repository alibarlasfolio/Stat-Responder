'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/lib/firebase-config';

interface FirebaseContextType {
  app: FirebaseApp;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebase, setFirebase] = useState<FirebaseContextType | null>(null);

  useEffect(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);

    enableIndexedDbPersistence(db)
      .then(() => console.log('Firestore offline persistence enabled.'))
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore offline persistence failed: multiple tabs open.');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore offline persistence is not supported in this browser.');
        }
      });
    
    setFirebase({ app, db });

  }, []);

  if (!firebase) {
    // Do not render children until firebase is initialized
    return null; 
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
