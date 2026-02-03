import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  statusBar: "light" | "dark";
}

export const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F3F4F6",
  surfaceSecondary: "#E5E7EB",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6B7280",
  primary: "#0D9488",
  border: "#D1D5DB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  statusBar: "dark",
};

export const darkTheme: ThemeColors = {
  background: "#000000",
  surface: "#0F1419",
  surfaceSecondary: "#1F2937",
  text: "#FFFFFF",
  textSecondary: "#E5E7EB",
  textMuted: "#9CA3AF",
  primary: "#2DD4BF",
  border: "#374151",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  statusBar: "light",
};

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      colors: lightTheme,
      toggleTheme: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        set({
          mode: newMode,
          colors: newMode === "light" ? lightTheme : darkTheme,
        });
      },
      setTheme: (mode: ThemeMode) => {
        set({
          mode,
          colors: mode === "light" ? lightTheme : darkTheme,
        });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;
