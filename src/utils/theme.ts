export const colors = {
  // Primary colors
  primary: "#2DD4BF", // Teal/Cyan accent
  primaryDark: "#14B8A6",
  primaryLight: "#5EEAD4",

  // Background colors
  background: "#000000",
  cardBackground: "#0F1419",
  cardBackgroundLight: "#1A2027",
  surfaceElevated: "#1F2937",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",

  // Status colors
  success: "#10B981",
  successLight: "#34D399",
  warning: "#F59E0B",
  warningLight: "#FBBF24",
  error: "#EF4444",
  errorLight: "#F87171",
  info: "#3B82F6",

  // Booking status colors
  confirmed: "#10B981",
  rac: "#F59E0B",
  waitlist: "#EF4444",
  regret: "#6B7280",

  // Border colors
  border: "#374151",
  borderLight: "#4B5563",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayDark: "rgba(0, 0, 0, 0.75)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  // Font families
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
    mono: "monospace",
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;
