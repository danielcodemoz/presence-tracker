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

export interface Account {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
  createdBy?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Account | null;
  accounts: Account[];
}

export interface AppSettings {
  reportTitle: string;
  language: 'en' | 'pt';
  theme: 'light' | 'dark' | 'blue' | 'green' | 'purple';
}

export type CellStatus = 'present' | 'absent' | null;

export type Language = 'en' | 'pt';

export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';