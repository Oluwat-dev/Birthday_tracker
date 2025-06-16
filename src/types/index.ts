export interface Person {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber?: string;
  roleOrGroup: string;
  photo?: string;
  celebrated?: boolean;
}

export interface BirthdayGroup {
  month: string;
  people: Person[];
}

export interface NotificationSettings {
  enabled: boolean;
  daysBefore: number;
}