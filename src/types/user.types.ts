export interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  notifications?: {
    delayAlerts?: boolean;
    platformChanges?: boolean;
    arrivalReminders?: boolean;
    departureReminders?: boolean;
  };
  defaultClass?: string;
  defaultQuota?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  phone: string;
  password: string;
  email?: string;
  name?: string;
}
