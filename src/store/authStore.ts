import { create } from "zustand";
import { User, LoginInput, RegisterInput } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginInput) => Promise<boolean>;
  register: (data: RegisterInput) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      set({ error: response.error || "Login failed", isLoading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      set({ error: response.error || "Registration failed", isLoading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      // First check local storage
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true });
      }

      // Then verify with server
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const response = await authService.getCurrentUser();
        if (response.success) {
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        set({ user: response.data, isLoading: false });
        return true;
      }
      set({ error: response.error || "Update failed", isLoading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Update failed",
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
