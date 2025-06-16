import { format, parseISO, isToday, isTomorrow, addDays, differenceInDays, startOfDay } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

export const formatBirthday = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd');
  } catch (error) {
    return dateString;
  }
};

export const getAge = (dateString: string): number => {
  try {
    const birthDate = parseISO(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 0;
  }
};

export const getNextBirthday = (dateString: string): Date => {
  try {
    const birthDate = parseISO(dateString);
    const today = new Date();
    const thisYear = today.getFullYear();
    
    let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    return nextBirthday;
  } catch (error) {
    return new Date();
  }
};

export const getDaysUntilBirthday = (dateString: string): number => {
  try {
    const nextBirthday = getNextBirthday(dateString);
    const today = startOfDay(new Date());
    return differenceInDays(startOfDay(nextBirthday), today);
  } catch (error) {
    return 0;
  }
};

export const isBirthdayToday = (dateString: string): boolean => {
  try {
    const nextBirthday = getNextBirthday(dateString);
    return isToday(nextBirthday);
  } catch (error) {
    return false;
  }
};

export const isBirthdayTomorrow = (dateString: string): boolean => {
  try {
    const nextBirthday = getNextBirthday(dateString);
    return isTomorrow(nextBirthday);
  } catch (error) {
    return false;
  }
};

export const isBirthdayUpcoming = (dateString: string, days: number = 7): boolean => {
  try {
    const daysUntil = getDaysUntilBirthday(dateString);
    return daysUntil >= 0 && daysUntil <= days;
  } catch (error) {
    return false;
  }
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || '';
};

export const sortByUpcomingBirthday = (people: any[]): any[] => {
  return [...people].sort((a, b) => {
    const daysA = getDaysUntilBirthday(a.dateOfBirth);
    const daysB = getDaysUntilBirthday(b.dateOfBirth);
    return daysA - daysB;
  });
};