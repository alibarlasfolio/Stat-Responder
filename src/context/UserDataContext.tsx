'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { EmergencyContact, MedicalInfo } from '@/types';
import { getEmergencyContacts as getContactsFromStorage, saveEmergencyContacts as saveContactsToStorage, getMedicalInfo as getMedicalFromStorage, saveMedicalInfo as saveMedicalToStorage } from '@/lib/storage';

interface UserDataContextType {
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo | null;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (contact: EmergencyContact) => void;
  deleteEmergencyContact: (id: string) => void;
  updateMedicalInfo: (info: MedicalInfo) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEmergencyContacts(getContactsFromStorage());
    setMedicalInfo(getMedicalFromStorage());
    setIsLoading(false);
  }, []);

  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    setEmergencyContacts(prev => {
      const updated = [...prev, newContact];
      saveContactsToStorage(updated);
      return updated;
    });
  }, []);

  const updateEmergencyContact = useCallback((updatedContact: EmergencyContact) => {
    setEmergencyContacts(prev => {
      const updated = prev.map(c => c.id === updatedContact.id ? updatedContact : c);
      saveContactsToStorage(updated);
      return updated;
    });
  }, []);

  const deleteEmergencyContact = useCallback((id: string) => {
    setEmergencyContacts(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveContactsToStorage(updated);
      return updated;
    });
  }, []);

  const updateMedicalInfo = useCallback((info: MedicalInfo) => {
    setMedicalInfo(info);
    saveMedicalToStorage(info);
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
