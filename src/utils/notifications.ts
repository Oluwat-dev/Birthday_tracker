import { Person, NotificationSettings } from '../types';
import { getDaysUntilBirthday, isBirthdayToday } from './dateUtils';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/birthday-icon.svg',
      badge: '/birthday-icon.svg',
      ...options
    });
  }
};

export const checkBirthdayNotifications = (people: Person[], settings: NotificationSettings): void => {
  if (!settings.enabled) return;

  people.forEach(person => {
    const daysUntil = getDaysUntilBirthday(person.dateOfBirth);
    
    if (isBirthdayToday(person.dateOfBirth)) {
      showNotification(
        `🎉 Today is ${person.fullName}'s Birthday!`,
        {
          body: `Don't forget to wish them a happy birthday!`,
          tag: `birthday-today-${person.id}`,
          requireInteraction: true
        }
      );
    } else if (daysUntil === settings.daysBefore) {
      showNotification(
        `🎂 Birthday Reminder`,
        {
          body: `${person.fullName}'s birthday is in ${daysUntil} day${daysUntil === 1 ? '' : 's'}!`,
          tag: `birthday-reminder-${person.id}`,
          requireInteraction: false
        }
      );
    }
  });
};

export const scheduleNotificationCheck = (people: Person[], settings: NotificationSettings): void => {
  // Check immediately
  checkBirthdayNotifications(people, settings);
  
  // Schedule daily checks
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // 9 AM next day
  
  const msUntilTomorrow = tomorrow.getTime() - now.getTime();
  
  setTimeout(() => {
    checkBirthdayNotifications(people, settings);
    // Set up daily interval
    setInterval(() => {
      checkBirthdayNotifications(people, settings);
    }, 24 * 60 * 60 * 1000); // 24 hours
  }, msUntilTomorrow);
};