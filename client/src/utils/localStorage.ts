import { Medication, MedicationLog } from '../types';

const MEDICATIONS_KEY = 'pillpal_medications';
const MEDICATION_LOGS_KEY = 'pillpal_medication_logs';
const THEME_KEY = 'pillpal_theme';
const USER_KEY = 'pillpal_user';

// Medications
export const saveMedicationsToLS = (medications: Medication[]): void => {
  try {
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error('Error saving medications to localStorage:', error);
  }
};

export const getMedicationsFromLS = (): Medication[] => {
  try {
    const medications = localStorage.getItem(MEDICATIONS_KEY);
    return medications ? JSON.parse(medications) : [];
  } catch (error) {
    console.error('Error getting medications from localStorage:', error);
    return [];
  }
};

export const addMedicationToLS = (medication: Medication): void => {
  try {
    const medications = getMedicationsFromLS();
    medications.push(medication);
    saveMedicationsToLS(medications);
  } catch (error) {
    console.error('Error adding medication to localStorage:', error);
  }
};

export const updateMedicationInLS = (updatedMedication: Medication): void => {
  try {
    const medications = getMedicationsFromLS();
    const index = medications.findIndex(med => med.id === updatedMedication.id);
    if (index !== -1) {
      medications[index] = updatedMedication;
      saveMedicationsToLS(medications);
    }
  } catch (error) {
    console.error('Error updating medication in localStorage:', error);
  }
};

export const deleteMedicationFromLS = (medicationId: number): void => {
  try {
    const medications = getMedicationsFromLS();
    const updatedMedications = medications.filter(med => med.id !== medicationId);
    saveMedicationsToLS(updatedMedications);
  } catch (error) {
    console.error('Error deleting medication from localStorage:', error);
  }
};

// Medication Logs
export const saveMedicationLogsToLS = (logs: MedicationLog[]): void => {
  try {
    localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving medication logs to localStorage:', error);
  }
};

export const getMedicationLogsFromLS = (): MedicationLog[] => {
  try {
    const logs = localStorage.getItem(MEDICATION_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting medication logs from localStorage:', error);
    return [];
  }
};

export const addMedicationLogToLS = (log: MedicationLog): void => {
  try {
    const logs = getMedicationLogsFromLS();
    logs.push(log);
    saveMedicationLogsToLS(logs);
  } catch (error) {
    console.error('Error adding medication log to localStorage:', error);
  }
};

// Theme
export const saveThemeToLS = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({ isDarkMode }));
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};

export const getThemeFromLS = (): { isDarkMode: boolean } => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme ? JSON.parse(theme) : { isDarkMode: false };
  } catch (error) {
    console.error('Error getting theme from localStorage:', error);
    return { isDarkMode: false };
  }
};

// User
export const saveUserToLS = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

export const getUserFromLS = (): any => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

export const clearUserFromLS = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

// Clear all data for a user (on logout)
export const clearUserData = (): void => {
  try {
    localStorage.removeItem(MEDICATIONS_KEY);
    localStorage.removeItem(MEDICATION_LOGS_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
};
