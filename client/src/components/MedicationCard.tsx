import React from 'react';
import { Medication, MedicationLog } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, EditIcon, RefreshCcwIcon } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onTake: (medication: Medication) => void;
  onRefill: (medication: Medication) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onTake,
  onRefill
}) => {
  const { name, dosage, instructions, remainingDoses, totalDoses, time } = medication;
  
  // Calculate remaining percentage
  const remainingPercentage = remainingDoses && totalDoses 
    ? Math.floor((remainingDoses / totalDoses) * 100) 
    : 100;
  
  // Determine if refill is needed soon (less than 25%)
  const needsRefill = remainingPercentage <= 25;
  
  // Get next dose time (simplistic version - would be more complex in real app)
  const getNextDoseTime = () => {
    try {
      const times = JSON.parse(time);
      if (!times || !times.length) return 'N/A';
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Find the next time that hasn't passed yet today
      for (const timeStr of times) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (hours > currentHour || (hours === currentHour && minutes > currentMinute)) {
          const dateObj = new Date();
          dateObj.setHours(hours, minutes, 0, 0);
          return formatTime(dateObj);
        }
      }
      
      // If all times have passed for today, return the first time for tomorrow
      const [hours, minutes] = times[0].split(':').map(Number);
      return formatTime(new Date().setHours(hours, minutes, 0, 0));
    } catch (error) {
      console.error('Error parsing time for medication:', error);
      return 'N/A';
    }
  };
  
  // Calculate days until refill is needed (based on dosage schedule)
  const getDaysUntilRefill = () => {
    if (!remainingDoses) return 'N/A';
    
    // This is a simplistic calculation - would need to be adjusted based on actual schedule
    switch (medication.schedule) {
      case 'daily':
        return remainingDoses;
      case 'weekly':
        return remainingDoses * 7;
      default:
        return remainingDoses;
    }
  };

  return (
    <Card className="overflow-hidden shadow">
      <CardContent className="p-0">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
              Active
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {dosage} - {instructions || 'Take as directed'}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {remainingDoses ? `${remainingDoses} doses` : 'Unknown'}
              </span>
            </div>
            <div className="mt-1 relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`absolute h-full ${needsRefill ? 'bg-amber-500' : 'bg-secondary-500'} rounded-full`} 
                style={{ width: `${remainingPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span>Next dose: {getNextDoseTime()}</span>
            </div>
            <div className={`text-sm ${needsRefill ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <span>{needsRefill ? 'Refill soon!' : `Refill in: ${getDaysUntilRefill()} days`}</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(medication)}
              className="inline-flex items-center text-xs"
            >
              <EditIcon className="h-3 w-3 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTake(medication)}
              className="inline-flex items-center text-xs"
            >
              <CheckIcon className="h-3 w-3 mr-1" />
              Take
            </Button>
            
            <Button
              variant={needsRefill ? "default" : "outline"}
              size="sm"
              onClick={() => onRefill(medication)}
              className={`inline-flex items-center text-xs ${needsRefill ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
            >
              <RefreshCcwIcon className="h-3 w-3 mr-1" />
              Refill{needsRefill ? ' Now' : ''}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
