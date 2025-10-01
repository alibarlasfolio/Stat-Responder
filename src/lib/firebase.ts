'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db)
      .then(() => console.log('Firestore offline persistence enabled.'))
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one.
          // The other tabs will still work just fine without persistence.
          console.warn('Firestore offline persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // The browser does not support all of the features required to enable persistence.
          console.warn('Firestore offline persistence is not supported in this browser.');
        }
      });
  } catch (err) {
      console.error("Error enabling Firestore persistence: ", err);
  }
}

export { app, db };
