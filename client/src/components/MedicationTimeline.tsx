import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';
import { useMedicationContext } from '../contexts/MedicationContext';
import { UpcomingDose } from '../types';

interface MedicationTimelineProps {
  date?: Date;
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ date = new Date() }) => {
  const { todaysDoses, recordMedicationDose } = useMedicationContext();

  const handleMarkAsTaken = async (dose: UpcomingDose) => {
    await recordMedicationDose(
      dose.medication.id,
      'taken',
      dose.scheduledTime,
      new Date()
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-4 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Medication Schedule</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
        </div>
      </div>
      
      {todaysDoses.length > 0 ? (
        <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
          {todaysDoses.map((dose, index) => {
            const isPast = new Date() > dose.scheduledTime;
            const isCurrent = dose.scheduledTime.getHours() === new Date().getHours() && 
                              !dose.status.includes('taken');
            
            return (
              <div key={`${dose.medication.id}-${index}`} className="p-4 flex items-center">
                <div className={`w-12 h-12 ${isCurrent ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'} rounded-full flex items-center justify-center mr-4`}>
                  <span className={`${isCurrent ? 'text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'} font-semibold`}>
                    {formatTime(dose.scheduledTime).split(':')[0]}
                    <span className="text-xs">{formatTime(dose.scheduledTime).split(':')[1]}</span>
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{dose.medication.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dose.medication.dosage} - {dose.medication.instructions || "Take as directed"}
                      </p>
                    </div>
                    <div>
                      {dose.status === 'taken' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                          Taken
                        </span>
                      ) : isPast ? (
                        <Button 
                          onClick={() => handleMarkAsTaken(dose)}
                          size="sm"
                          className="inline-flex items-center px-3 py-1.5 text-xs rounded-full bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark as Taken
                        </Button>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No medications scheduled for today.</p>
        </div>
      )}
    </div>
  );
};

export default MedicationTimeline;
