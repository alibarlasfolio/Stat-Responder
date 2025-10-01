'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { EmergencyContact, MedicalInfo } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Hardcoded user for demonstration purposes. In a real app, this would be dynamic.
const USER_ID = 'default-user';

interface UserDataContextType {
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo | null;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateEmergencyContact: (contact: EmergencyContact) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  updateMedicalInfo: (info: MedicalInfo) => Promise<void>;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', USER_ID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setEmergencyContacts(data.emergencyContacts || []);
        setMedicalInfo(data.medicalInfo || null);
      } else {
        // If no document exists, create one with default empty values
        await setDoc(userDocRef, { emergencyContacts: [], medicalInfo: null });
        setEmergencyContacts([]);
        setMedicalInfo(null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEmergencyContact = useCallback(async (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    const userDocRef = doc(db, 'users', USER_ID);
    await updateDoc(userDocRef, {
      emergencyContacts: arrayUnion(newContact)
    });
    setEmergencyContacts(prev => [...prev, newContact]);
  }, []);

  const updateEmergencyContact = useCallback(async (updatedContact: EmergencyContact) => {
    const userDocRef = doc(db, 'users', USER_ID);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const currentContacts = userDocSnap.data().emergencyContacts || [];
      const updatedContacts = currentContacts.map((c: EmergencyContact) => c.id === updatedContact.id ? updatedContact : c);
      await setDoc(userDocRef, { emergencyContacts: updatedContacts }, { merge: true });
      setEmergencyContacts(updatedContacts);
    }
  }, []);

  const deleteEmergencyContact = useCallback(async (id: string) => {
    const userDocRef = doc(db, 'users', USER_ID);
    const userDocSnap = await getDoc(userDocRef);
     if (userDocSnap.exists()) {
      const currentContacts = userDocSnap.data().emergencyContacts || [];
      const contactToDelete = currentContacts.find((c: EmergencyContact) => c.id === id);
      if(contactToDelete) {
        await updateDoc(userDocRef, {
            emergencyContacts: arrayRemove(contactToDelete)
        });
        setEmergencyContacts(prev => prev.filter(c => c.id !== id));
      }
    }
  }, []);

  const updateMedicalInfo = useCallback(async (info: MedicalInfo) => {
    const userDocRef = doc(db, 'users', USER_ID);
    await setDoc(userDocRef, { medicalInfo: info }, { merge: true });
    setMedicalInfo(info);
  }, []);

  return (
    <UserDataContext.Provider value={{ emergencyContacts, medicalInfo, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact, updateMedicalInfo, isLoading }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
