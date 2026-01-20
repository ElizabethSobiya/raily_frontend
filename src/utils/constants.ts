export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/v1";
export const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL || "ws://localhost:3000";

export const TRAIN_TYPES = {
  RAJDHANI: "Rajdhani",
  SHATABDI: "Shatabdi",
  DURONTO: "Duronto",
  VANDE_BHARAT: "Vande Bharat",
  SUPERFAST: "Superfast",
  EXPRESS: "Express",
  MAIL: "Mail",
  PASSENGER: "Passenger",
} as const;

export const COACH_TYPES = {
  "1A": "First AC",
  "2A": "AC 2 Tier",
  "3A": "AC 3 Tier",
  "3E": "AC 3 Economy",
  SL: "Sleeper",
  CC: "AC Chair Car",
  EC: "Executive Chair Car",
  "2S": "Second Sitting",
  GN: "General",
} as const;

export const BOOKING_STATUS = {
  CNF: "Confirmed",
  RAC: "RAC",
  WL: "Waiting List",
  RLWL: "Remote Location WL",
  PQWL: "Pooled Quota WL",
  GNWL: "General WL",
  REGRET: "Regret",
} as const;

export const TRIP_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const POPULAR_ROUTES = [
  { from: "NDLS", to: "BCT", fromName: "New Delhi", toName: "Mumbai" },
  { from: "NDLS", to: "MAS", fromName: "New Delhi", toName: "Chennai" },
  { from: "NDLS", to: "HWH", fromName: "New Delhi", toName: "Howrah" },
  { from: "NDLS", to: "SBC", fromName: "New Delhi", toName: "Bengaluru" },
  { from: "BCT", to: "ADI", fromName: "Mumbai", toName: "Ahmedabad" },
  { from: "MAS", to: "SBC", fromName: "Chennai", toName: "Bengaluru" },
] as const;

export const REFRESH_INTERVALS = {
  LIVE_STATUS: 30000, // 30 seconds
  PNR_STATUS: 60000, // 1 minute
  TRAIN_LIST: 300000, // 5 minutes
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
  RECENT_SEARCHES: "recentSearches",
  OFFLINE_TRIPS: "offlineTrips",
} as const;
