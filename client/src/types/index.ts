export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Medication {
  id: number | string;  // Changed to accept string IDs from Firestore
  userId: string;
  name: string;
  dosage: string;
  instructions?: string;
  schedule: 'daily' | 'weekly' | 'custom';
  time: string; // JSON string of times
  remainingDoses?: number;
  totalDoses?: number;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationLog {
  id: number | string;  // Changed to accept string IDs from Firestore
  medicationId: number | string;  // Changed to accept string IDs from Firestore
  userId: string;
  status: 'taken' | 'missed' | 'skipped';
  scheduledTime: Date;
  takenTime?: Date;
  notes?: string;
  createdAt: Date;
}

export interface MedicationForm {
  name: string;
  dosage: string;
  instructions?: string;  // Changed to optional to match form handling
  schedule: string;
  timeOfDay: string[];
  quantity: number;
  barcode?: string;
}

export interface Profile {
  id: number;
  userId: string;
  name: string;
  relationship?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationWithDoseStatus extends Medication {
  doseStatus?: 'taken' | 'due' | 'upcoming' | 'missed';
  nextDoseTime?: string;
  lastLog?: MedicationLog;
}

export type UpcomingDose = {
  medication: Medication;
  scheduledTime: Date;
  status: 'taken' | 'due' | 'upcoming';
};
