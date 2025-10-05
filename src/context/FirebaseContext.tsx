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

  useEffect(() => {
    const initialize = async () => {
      try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const db = getFirestore(app);
        
        // Attempt to enable persistence
        await enableIndexedDbPersistence(db);
        console.log('Firestore offline persistence enabled.');
        
        setFirebase({ app, db });
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore offline persistence failed: multiple tabs open or other issue.');
          // If persistence fails, we can still proceed with an online-only client.
          // Re-initialize without waiting for persistence to resolve.
          const app = getApp();
          const db = getFirestore(app);
          setFirebase({ app, db });
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore offline persistence is not supported in this browser.');
           const app = getApp();
          const db = getFirestore(app);
          setFirebase({ app, db });
        } else {
          console.error("Firebase initialization error:", err);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();

  }, []);

  if (isInitializing) {
    // While initializing, you can show a loading spinner or a blank screen.
    // This prevents children from trying to access a null Firebase context.
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-semibold">Initializing Firebase...</div>
        </div>
    );
  }
  
  if (!firebase) {
    // Handle the case where initialization failed
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
