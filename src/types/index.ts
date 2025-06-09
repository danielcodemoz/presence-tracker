export interface User {
  id: string;
  name: string;
  totalPresent: number;
  totalAbsent: number;
}

export interface PresenceData {
  [userId: string]: {
    [day: number]: 'present' | 'absent' | null;
  };
}

export interface Excuse {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  description: string;
}

export interface AppState {
  users: User[];
  selectedDays: number[];
  presenceData: PresenceData;
  excuses: Excuse[];
  currentMonth: number;
  currentYear: number;
  isDarkMode: boolean;
}

export type CellStatus = 'present' | 'absent' | null;