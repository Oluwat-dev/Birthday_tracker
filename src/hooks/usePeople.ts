import { useState, useEffect } from 'react';
import { Person, NotificationSettings } from '../types';
import { storage } from '../utils/storage';
import { scheduleNotificationCheck } from '../utils/notifications';

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    daysBefore: 3
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from storage
    const storedPeople = storage.getPeople();
    const storedSettings = storage.getSettings();
    
    setPeople(storedPeople);
    setSettings(storedSettings);
    setLoading(false);

    // Schedule notification checks
    scheduleNotificationCheck(storedPeople, storedSettings);
  }, []);

  const addPerson = (person: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...person,
      id: crypto.randomUUID()
    };
    
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    storage.setPeople(updatedPeople);
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    const updatedPeople = people.map(person =>
      person.id === id ? { ...person, ...updates } : person
    );
    setPeople(updatedPeople);
    storage.setPeople(updatedPeople);
  };

  const deletePerson = (id: string) => {
    const updatedPeople = people.filter(person => person.id !== id);
    setPeople(updatedPeople);
    storage.setPeople(updatedPeople);
  };

  const importPeople = (newPeople: Person[]) => {
    const updatedPeople = [...people, ...newPeople];
    setPeople(updatedPeople);
    storage.setPeople(updatedPeople);
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    storage.setSettings(newSettings);
    scheduleNotificationCheck(people, newSettings);
  };

  const markCelebrated = (id: string, celebrated: boolean) => {
    updatePerson(id, { celebrated });
  };

  return {
    people,
    settings,
    loading,
    addPerson,
    updatePerson,
    deletePerson,
    importPeople,
    updateSettings,
    markCelebrated
  };
};