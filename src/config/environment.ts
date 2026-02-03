import { Platform } from "react-native";

interface Environment {
  apiUrl: string;
  wsUrl: string;
}

// For development: Use your Mac's local IP address
// Run `ifconfig | grep "inet "` to find your IP if it changes
const LOCAL_IP = "192.168.0.113";

const ENV: Record<string, Environment> = {
  development: {
    // Android emulator uses 10.0.2.2 to reach host, iOS simulator can use local IP
    apiUrl: Platform.select({
      android: "http://10.0.2.2:3000/v1",
      ios: `http://${LOCAL_IP}:3000/v1`,
      default: `http://${LOCAL_IP}:3000/v1`,
    }) as string,
    wsUrl: Platform.select({
      android: "ws://10.0.2.2:3000",
      ios: `ws://${LOCAL_IP}:3000`,
      default: `ws://${LOCAL_IP}:3000`,
    }) as string,
  },
  staging: {
    apiUrl: "https://api-staging.railtrack.com/v1",
    wsUrl: "wss://api-staging.railtrack.com",
  },
  production: {
    apiUrl: "https://api.railtrack.com/v1",
    wsUrl: "wss://api.railtrack.com",
  },
};

const getEnvironment = (): string => {
  if (__DEV__) return "development";
  return process.env.EXPO_PUBLIC_ENV || "production";
};

const getEnvVars = (): Environment => {
  const env = getEnvironment();
  return ENV[env] || ENV.production;
};

export const environment = getEnvVars();
export default environment;
