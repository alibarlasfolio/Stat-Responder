export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface MedicalInfo {
  allergies: string; // Comma-separated or newline-separated
  medications: string; // Comma-separated or newline-separated
  conditions: string; // Comma-separated or newline-separated
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
