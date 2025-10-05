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
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (!hasMounted) return;
      try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        // Use the correct database ID for your project
        const db = getFirestore(app, 'stat-responder');
        
        // Attempt to enable persistence
        await enableIndexedDbPersistence(db);
        console.log('Firestore offline persistence enabled.');
        
        setFirebase({ app, db });
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore offline persistence failed: multiple tabs open or other issue.');
          const app = getApp();
          const db = getFirestore(app, 'stat-responder');
          setFirebase({ app, db });
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore offline persistence is not supported in this browser.');
           const app = getApp();
           const db = getFirestore(app, 'stat-responder');
          setFirebase({ app, db });
        } else {
          console.error("Firebase initialization error:", err);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();

  }, [hasMounted]);

  if (!hasMounted || isInitializing) {
    if (hasMounted && isInitializing) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold">Initializing Firebase...</div>
        </div>
      );
    }
    return null;
  }
  
  if (!firebase) {
     return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-semibold text-destructive">Could not initialize Firebase.</div>
        </div>
    );
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
