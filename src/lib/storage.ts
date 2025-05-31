import type { EmergencyContact, MedicalInfo } from '@/types';

const EMERGENCY_CONTACTS_KEY = 'statresponder_emergency_contacts';
const MEDICAL_INFO_KEY = 'statresponder_medical_info';

export const getEmergencyContacts = (): EmergencyContact[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EMERGENCY_CONTACTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEmergencyContacts = (contacts: EmergencyContact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(contacts));
};

export const getMedicalInfo = (): MedicalInfo | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(MEDICAL_INFO_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveMedicalInfo = (info: MedicalInfo): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEDICAL_INFO_KEY, JSON.stringify(info));
};
