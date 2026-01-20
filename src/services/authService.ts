import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthResponse, LoginInput, RegisterInput, ApiResponse } from "../types";
import { STORAGE_KEYS } from "../utils/constants";

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post("/auth/register", data);

    if (response.data.success) {
      const { token, refreshToken, user } = response.data.data;
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
    }

    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post("/auth/login", data);

    if (response.data.success) {
      const { token, refreshToken, user } = response.data.data;
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
    }

    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore error, still clear local storage
    }

    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: { name?: string; email?: string }): Promise<ApiResponse<User>> => {
    const response = await api.put("/auth/me", data);

    if (response.data.success) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));
    }

    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Record<string, unknown>): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.put("/auth/me/preferences", preferences);
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  /**
   * Get stored user data
   */
  getStoredUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Register FCM token for push notifications
   */
  registerFCMToken: async (fcmToken: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post("/auth/fcm/register", { fcmToken });
    return response.data;
  },
};

export default authService;
