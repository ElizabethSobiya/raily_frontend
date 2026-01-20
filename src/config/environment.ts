interface Environment {
  apiUrl: string;
  wsUrl: string;
}

const ENV: Record<string, Environment> = {
  development: {
    apiUrl: "http://localhost:3000/v1",
    wsUrl: "ws://localhost:3000",
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
