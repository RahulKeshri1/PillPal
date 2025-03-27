import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import useMedication from '../hooks/useMedication';
import { Medication, MedicationLog, MedicationForm, UpcomingDose } from '../types';
import { scheduleAllMedicationReminders, requestNotificationPermission } from '../utils/notifications';

interface MedicationContextType {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  upcomingDoses: UpcomingDose[];
  todaysDoses: UpcomingDose[];
  loading: boolean;
  error: string | null;
  addMedication: (medication: MedicationForm) => Promise<Medication | null>;
  updateMedication: (id: number | string, updates: Partial<Medication>) => Promise<boolean>;
  deleteMedication: (id: number | string) => Promise<boolean>;
  recordMedicationDose: (medicationId: number | string, status: 'taken' | 'missed' | 'skipped', scheduledTime: Date, takenTime?: Date) => Promise<boolean>;
  refreshData: () => Promise<void>;
  getMedicationById: (id: number | string) => Medication | undefined;
  getDosesByDate: (date: Date) => UpcomingDose[];
  getLogsByMedicationId: (medicationId: number | string) => MedicationLog[];
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedicationContext = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedicationContext must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { 
    medications, 
    medicationLogs, 
    loading, 
    error, 
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationDose,
    refreshMedications,
    refreshMedicationLogs
  } = useMedication(currentUser?.uid || null);
  
  const [upcomingDoses, setUpcomingDoses] = useState<UpcomingDose[]>([]);
  const [todaysDoses, setTodaysDoses] = useState<UpcomingDose[]>([]);

  // Calculate upcoming doses whenever medications change
  useEffect(() => {
    calculateUpcomingDoses();
  }, [medications, medicationLogs]);

  // Set up notifications for medications
  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        scheduleAllMedicationReminders(medications);
      }
    };
    
    if (medications.length > 0) {
      setupNotifications();
    }
  }, [medications]);

  // Calculate upcoming and today's doses
  const calculateUpcomingDoses = () => {
    const now = new Date();
    const upcoming: UpcomingDose[] = [];
    const today: UpcomingDose[] = [];
    
    medications.forEach(medication => {
      try {
        const times = JSON.parse(medication.time);
        times.forEach((timeStr: string) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          // Create a date object for this scheduled time
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // If time has passed for today, schedule for tomorrow
          if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          // Check if this dose has already been taken today
          const isDoseTaken = medicationLogs.some(log => {
            const logDate = new Date(log.scheduledTime);
            return (
              log.medicationId === medication.id &&
              log.status === 'taken' &&
              logDate.getFullYear() === now.getFullYear() &&
              logDate.getMonth() === now.getMonth() &&
              logDate.getDate() === now.getDate() &&
              logDate.getHours() === hours &&
              logDate.getMinutes() === minutes
            );
          });
          
          // Determine status
          let status: 'taken' | 'due' | 'upcoming' = 'upcoming';
          if (isDoseTaken) {
            status = 'taken';
          } else if (
            scheduledTime.getDate() === now.getDate() &&
            scheduledTime.getMonth() === now.getMonth() &&
            scheduledTime.getFullYear() === now.getFullYear()
          ) {
            status = 'due';
          }
          
          const dose: UpcomingDose = {
            medication,
            scheduledTime,
            status
          };
          
          upcoming.push(dose);
          
          // Add to today's doses if it's scheduled for today
          if (
            scheduledTime.getDate() === now.getDate() &&
            scheduledTime.getMonth() === now.getMonth() &&
            scheduledTime.getFullYear() === now.getFullYear()
          ) {
            today.push(dose);
          }
        });
      } catch (error) {
        console.error(`Error parsing time for medication ${medication.name}:`, error);
      }
    });
    
    // Sort upcoming doses by time
    upcoming.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    today.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    
    setUpcomingDoses(upcoming);
    setTodaysDoses(today);
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([refreshMedications(), refreshMedicationLogs()]);
    calculateUpcomingDoses();
  };

  // Get a medication by ID
  const getMedicationById = (id: number | string) => {
    return medications.find(med => med.id === id);
  };

  // Get doses for a specific date
  const getDosesByDate = (date: Date) => {
    return upcomingDoses.filter(dose => {
      const doseDate = new Date(dose.scheduledTime);
      return (
        doseDate.getFullYear() === date.getFullYear() &&
        doseDate.getMonth() === date.getMonth() &&
        doseDate.getDate() === date.getDate()
      );
    });
  };

  // Get logs for a specific medication
  const getLogsByMedicationId = (medicationId: number | string) => {
    return medicationLogs.filter(log => log.medicationId === medicationId);
  };

  const value: MedicationContextType = {
    medications,
    medicationLogs,
    upcomingDoses,
    todaysDoses,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationDose,
    refreshData,
    getMedicationById,
    getDosesByDate,
    getLogsByMedicationId
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};
