import React, { useState } from 'react';
import { MedicationLog } from '../types';
import { CheckIcon, XIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime } from '../utils/dateUtils';
import { useMedicationContext } from '../contexts/MedicationContext';

interface MedicationHistoryProps {
  initialLogs?: MedicationLog[];
}

const MedicationHistory: React.FC<MedicationHistoryProps> = ({ initialLogs }) => {
  const { medicationLogs, medications } = useMedicationContext();
  const [timeFrame, setTimeFrame] = useState('7');
  
  const logs = initialLogs || medicationLogs;
  
  // Filter logs based on selected time frame
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.scheduledTime);
    const now = new Date();
    const daysAgo = parseInt(timeFrame, 10);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysAgo);
    
    return logDate >= cutoffDate;
  });
  
  // Sort logs by scheduledTime, most recent first
  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
  );
  
  // Find medication name by id
  const getMedicationName = (medicationId: number) => {
    const medication = medications.find(med => med.id === medicationId);
    return medication ? `${medication.name} ${medication.dosage}` : 'Unknown medication';
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium font-display text-gray-900 dark:text-white">Medication History</h2>
        <div>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {sortedLogs.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedLogs.map(log => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 ${log.status === 'taken' ? 'bg-primary-100 dark:bg-primary-800' : 'bg-red-100 dark:bg-red-800'} rounded-full flex items-center justify-center`}>
                        {log.status === 'taken' ? (
                          <CheckIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                        ) : (
                          <XIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getMedicationName(log.medicationId)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(log.scheduledTime)}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      {log.status === 'taken' ? (
                        log.takenTime && new Date(log.takenTime).getTime() > new Date(log.scheduledTime).getTime() + 15 * 60000 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100">
                            Taken {Math.floor((new Date(log.takenTime).getTime() - new Date(log.scheduledTime).getTime()) / 60000)} minutes late
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                            Taken on time
                          </span>
                        )
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100">
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No medication history for the selected time frame.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationHistory;
