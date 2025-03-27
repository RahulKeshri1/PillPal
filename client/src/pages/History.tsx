import React from 'react';
import Header from '../components/Header';
import MobileNavigation from '../components/MobileNavigation';
import MedicationHistory from '../components/MedicationHistory';

const History: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold font-display text-gray-900 dark:text-white mb-6">Medication History</h1>
            
            <MedicationHistory />
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default History;
