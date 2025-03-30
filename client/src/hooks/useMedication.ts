import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Medication, MedicationLog, MedicationForm } from '../types';
import {
  getMedicationsFromLS,
  saveMedicationsToLS,
  getMedicationLogsFromLS,
  saveMedicationLogsToLS,
  addMedicationToLS,
  updateMedicationInLS,
  deleteMedicationFromLS,
  addMedicationLogToLS
} from '../utils/localStorage';

export const useMedication = (userId: string | null) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load medications from Firestore or localStorage
  const loadMedications = async () => {
    if (!userId) {
      const localMedications = getMedicationsFromLS();
      setMedications(localMedications);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Firestore
      const medicationsQuery = query(
        collection(db, 'medications'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(medicationsQuery);
      const medicationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          dosage: data.dosage,
          instructions: data.instructions,
          schedule: data.schedule,
          time: data.time,
          remainingDoses: data.remainingDoses,
          totalDoses: data.totalDoses,
          barcode: data.barcode,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Medication;
      });

      setMedications(medicationsData);
      
      // Also save to localStorage for offline access
      saveMedicationsToLS(medicationsData);
    } catch (err) {
      console.error('Error loading medications:', err);
      
      // If Firestore fails, try localStorage
      const localMedications = getMedicationsFromLS();
      setMedications(localMedications);
      
      setError('Failed to load medications from the server. Using locally saved data.');
    } finally {
      setLoading(false);
    }
  };

  // Load medication logs from Firestore or localStorage
  const loadMedicationLogs = async () => {
    if (!userId) {
      const localLogs = getMedicationLogsFromLS();
      setMedicationLogs(localLogs);
      return;
    }

    try {
      // Try to fetch from Firestore
      const logsQuery = query(
        collection(db, 'medicationLogs'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(logsQuery);
      const logsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          medicationId: data.medicationId,
          userId: data.userId,
          status: data.status,
          scheduledTime: data.scheduledTime?.toDate() || new Date(),
          takenTime: data.takenTime?.toDate() || null,
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date()
        } as MedicationLog;
      });

      setMedicationLogs(logsData);
      
      // Also save to localStorage for offline access
      saveMedicationLogsToLS(logsData);
    } catch (err) {
      console.error('Error loading medication logs:', err);
      
      // If Firestore fails, try localStorage
      const localLogs = getMedicationLogsFromLS();
      setMedicationLogs(localLogs);
    }
  };

  // Add a new medication
  const addMedication = async (medicationData: MedicationForm): Promise<Medication | null> => {
    console.log('Adding medication with data:', medicationData);
    try {
      setError(null);
      
      console.log('Current userId:', userId);
      
      const newMedication: Partial<Medication> = {
        userId: userId || 'offline',
        name: medicationData.name,
        dosage: medicationData.dosage,
        instructions: medicationData.instructions,
        schedule: medicationData.schedule as 'daily' | 'weekly' | 'custom',
        time: JSON.stringify(medicationData.timeOfDay.map(time => time)),
        remainingDoses: medicationData.quantity,
        totalDoses: medicationData.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('Created newMedication object:', newMedication);

      if (userId) {
        console.log('Adding to Firestore with userId:', userId);
        // Add to Firestore
        try {
          const medRef = doc(collection(db, 'medications'));
          console.log('Created reference to medications collection');
          
          await setDoc(medRef, {
            ...newMedication,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          
          console.log('Successfully added document to Firestore with ID:', medRef.id);

          const savedMedication = {
            id: medRef.id,
            ...newMedication
          } as Medication;

          console.log('Saved medication:', savedMedication);
          
          setMedications(prev => [...prev, savedMedication]);
          
          // Also save to localStorage
          addMedicationToLS(savedMedication);
          
          return savedMedication;
        } catch (firestoreErr) {
          console.error('Firestore error:', firestoreErr);
          throw firestoreErr;
        }
      } else {
        console.log('Adding to localStorage only (offline mode)');
        // Add to localStorage only (offline mode)
        const newId = Date.now();
        const savedMedication = {
          id: newId,
          ...newMedication
        } as Medication;

        console.log('Created offline medication with ID:', newId);
        
        setMedications(prev => [...prev, savedMedication]);
        addMedicationToLS(savedMedication);
        
        return savedMedication;
      }
    } catch (err) {
      console.error('Error adding medication:', err);
      setError('Failed to add medication. Please try again.');
      return null;
    }
  };

  // Update an existing medication
  const updateMedication = async (id: number | string, updates: Partial<Medication>): Promise<boolean> => {
    try {
      setError(null);
      
      const updatedMedication = {
        ...medications.find(med => med.id === id),
        ...updates,
        updatedAt: new Date()
      } as Medication;

      if (userId) {
        // Update in Firestore
        const medRef = doc(db, 'medications', String(id));
        await updateDoc(medRef, {
          ...updates,
          updatedAt: Timestamp.now()
        });
      }

      // Update in state
      setMedications(prev => 
        prev.map(med => med.id === id ? updatedMedication : med)
      );
      
      // Update in localStorage
      updateMedicationInLS(updatedMedication);
      
      return true;
    } catch (err) {
      console.error('Error updating medication:', err);
      setError('Failed to update medication. Please try again.');
      return false;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: number | string): Promise<boolean> => {
    try {
      setError(null);

      if (userId) {
        // Delete from Firestore
        const medRef = doc(db, 'medications', String(id));
        await deleteDoc(medRef);
      }

      // Delete from state
      setMedications(prev => prev.filter(med => med.id !== id));
      
      // Delete from localStorage
      deleteMedicationFromLS(Number(id));
      
      return true;
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError('Failed to delete medication. Please try again.');
      return false;
    }
  };

  // Record a medication dose
  const recordMedicationDose = async (
    medicationId: number | string,
    status: 'taken' | 'missed' | 'skipped',
    scheduledTime: Date,
    takenTime?: Date
  ): Promise<boolean> => {
    try {
      setError(null);
      
      // First, update the remaining doses if taken
      if (status === 'taken') {
        const medication = medications.find(med => med.id === medicationId);
        if (medication && medication.remainingDoses && medication.remainingDoses > 0) {
          await updateMedication(medicationId, {
            remainingDoses: medication.remainingDoses - 1
          });
        }
      }

      const logData: Partial<MedicationLog> = {
        medicationId: Number(medicationId),
        userId: userId || 'offline',
        status,
        scheduledTime,
        takenTime: status === 'taken' ? (takenTime || new Date()) : undefined,
        createdAt: new Date()
      };

      if (userId) {
        // Add to Firestore
        const logRef = doc(collection(db, 'medicationLogs'));
        await setDoc(logRef, {
          ...logData,
          createdAt: Timestamp.now(),
          scheduledTime: Timestamp.fromDate(scheduledTime),
          takenTime: status === 'taken' ? Timestamp.fromDate(takenTime || new Date()) : null
        });

        const savedLog = {
          id: logRef.id,
          ...logData
        } as MedicationLog;

        setMedicationLogs(prev => [...prev, savedLog]);
        
        // Also save to localStorage
        addMedicationLogToLS(savedLog);
      } else {
        // Add to localStorage only (offline mode)
        const newId = Date.now();
        const savedLog = {
          id: newId,
          ...logData
        } as MedicationLog;

        setMedicationLogs(prev => [...prev, savedLog]);
        addMedicationLogToLS(savedLog);
      }
      
      return true;
    } catch (err) {
      console.error('Error recording medication dose:', err);
      setError('Failed to record medication dose. Please try again.');
      return false;
    }
  };

  // Load data when component mounts or userId changes
  useEffect(() => {
    loadMedications();
    loadMedicationLogs();
  }, [userId]);

  return {
    medications,
    medicationLogs,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationDose,
    refreshMedications: loadMedications,
    refreshMedicationLogs: loadMedicationLogs
  };
};

export default useMedication;
