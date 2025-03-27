import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import MobileNavigation from '../components/MobileNavigation';
import MedicationTimeline from '../components/MedicationTimeline';
import MedicationCard from '../components/MedicationCard';
import MedicationHistory from '../components/MedicationHistory';
import AddMedicationModal from '../components/AddMedicationModal';
import { useMedicationContext } from '../contexts/MedicationContext';
import { requestNotificationPermission } from '../utils/notifications';
import { Medication } from '../types';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { medications, medicationLogs, recordMedicationDose, refreshData } = useMedicationContext();
  const { toast } = useToast();

  // Request notification permission on component mount
  useEffect(() => {
    const requestPermission = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast({
          title: "Notification Permission",
          description: "Please enable notifications to receive medication reminders.",
          variant: "destructive",
        });
      }
    };
    requestPermission();
    
    // Refresh medication data
    refreshData();
  }, []);

  const handleEditMedication = (medication: Medication) => {
    // Navigate to edit page or open edit modal
    toast({
      title: "Edit Medication",
      description: `Edit functionality for ${medication.name} will be implemented.`,
    });
  };

  const handleTakeMedication = async (medication: Medication) => {
    // Record medication as taken
    const now = new Date();
    await recordMedicationDose(
      medication.id,
      'taken',
      now,
      now
    );
    
    toast({
      title: "Medication Taken",
      description: `You have successfully recorded ${medication.name}.`,
      variant: "default",
    });
  };

  const handleRefillMedication = (medication: Medication) => {
    // Implement refill functionality
    toast({
      title: "Refill Medication",
      description: `Refill functionality for ${medication.name} will be implemented.`,
    });
  };

  // Get the most recent logs for the history section
  const recentLogs = medicationLogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold font-display text-gray-900 dark:text-white">Today's Medications</h1>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MedicationTimeline />
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium font-display text-gray-900 dark:text-white">My Medications</h2>
                <AddMedicationModal />
              </div>
              
              {medications.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {medications.map(medication => (
                    <MedicationCard
                      key={medication.id}
                      medication={medication}
                      onEdit={handleEditMedication}
                      onTake={handleTakeMedication}
                      onRefill={handleRefillMedication}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any medications yet.</p>
                  <AddMedicationModal />
                </div>
              )}
            </div>
            
            <MedicationHistory initialLogs={recentLogs} />
          </div>
        </div>
      </main>
      
      <MobileNavigation />
      
      <div className="fixed sm:hidden z-10 bottom-20 right-4">
        <AddMedicationModal />
      </div>
    </div>
  );
};

export default Dashboard;
