import React, { useState } from 'react';
import Header from '../components/Header';
import MobileNavigation from '../components/MobileNavigation';
import MedicationCard from '../components/MedicationCard';
import AddMedicationModal from '../components/AddMedicationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Medication } from '../types';
import { useMedicationContext } from '../contexts/MedicationContext';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

const Medications: React.FC = () => {
  const { medications, recordMedicationDose } = useMedicationContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter medications based on search term
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.instructions && med.instructions.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold font-display text-gray-900 dark:text-white">My Medications</h1>
              <AddMedicationModal />
            </div>
            
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search medications..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {filteredMedications.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMedications.map(medication => (
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
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
                {searchTerm ? (
                  <p className="text-gray-500 dark:text-gray-400">No medications found matching "{searchTerm}"</p>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any medications yet.</p>
                    <AddMedicationModal />
                  </>
                )}
              </div>
            )}
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

export default Medications;
