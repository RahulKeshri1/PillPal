import { Medication } from '../types';

// Check if browser supports notifications
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationSupport()) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Send a notification
export const sendNotification = (
  title: string,
  options: NotificationOptions = {}
): Notification | null => {
  if (!checkNotificationSupport()) {
    console.warn('Notifications are not supported in this browser');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    return new Notification(title, options);
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

// Schedule a medication reminder notification
export const scheduleMedicationReminder = (
  medication: Medication,
  scheduledTime: Date
): number => {
  const now = new Date();
  const timeUntilReminder = scheduledTime.getTime() - now.getTime();

  if (timeUntilReminder <= 0) {
    console.warn('Cannot schedule a reminder in the past');
    return -1;
  }

  const timerId = window.setTimeout(() => {
    sendNotification(`Time to take ${medication.name}`, {
      body: `${medication.dosage} - ${medication.instructions || 'Take as directed'}`,
      icon: '/favicon.ico',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: {
        medicationId: medication.id,
        scheduledTime: scheduledTime.toISOString(),
      },
    });
  }, timeUntilReminder);

  return timerId;
};

// Cancel a scheduled notification
export const cancelScheduledReminder = (timerId: number): void => {
  window.clearTimeout(timerId);
};

// Set up notification click handler
export const setupNotificationClickHandler = (): void => {
  if (!checkNotificationSupport()) return;

  navigator.serviceWorker?.addEventListener('message', (event) => {
    const { medicationId, action } = event.data;
    
    if (action === 'notificationClick' && medicationId) {
      // Handle notification click, e.g., show take medication dialog
      window.focus();
      console.log('Notification clicked for medication ID:', medicationId);
    }
  });
};

// Schedule reminders for all medications
export const scheduleAllMedicationReminders = (
  medications: Medication[]
): Record<string, number> => {
  const reminderIds: Record<string, number> = {};

  medications.forEach((medication) => {
    try {
      const scheduleTimes = JSON.parse(medication.time);
      
      scheduleTimes.forEach((time: string, index: number) => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date();
        
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // If the time has already passed today, schedule for tomorrow
        if (scheduledTime.getTime() < Date.now()) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const timerId = scheduleMedicationReminder(medication, scheduledTime);
        reminderIds[`${medication.id}_${index}`] = timerId;
      });
    } catch (error) {
      console.error(`Error scheduling reminders for medication ${medication.name}:`, error);
    }
  });

  return reminderIds;
};
