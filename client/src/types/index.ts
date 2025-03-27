export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Medication {
  id: number;
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
  id: number;
  medicationId: number;
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
  instructions: string;
  schedule: string;
  timeOfDay: string[];
  quantity: number;
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
