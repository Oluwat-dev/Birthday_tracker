export const STORAGE_KEYS = {
  PEOPLE: 'birthday-tracker-people',
  SETTINGS: 'birthday-tracker-settings',
} as const;

export interface StorageData {
  people: any[];
  settings: any;
}

export const storage = {
  getPeople: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PEOPLE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading people from storage:', error);
      return [];
    }
  },

  setPeople: (people: any[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
    } catch (error) {
      console.error('Error saving people to storage:', error);
    }
  },

  getSettings: (): any => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        enabled: true,
        daysBefore: 3
      };
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      return { enabled: true, daysBefore: 3 };
    }
  },

  setSettings: (settings: any): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PEOPLE);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};