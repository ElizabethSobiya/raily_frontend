import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";

// Screens
import { MyTripsScreen, PNRStatusScreen, SearchScreen } from "./src/screens";

// Store
import { useAuthStore } from "./src/store/authStore";

// Theme
import { colors } from "./src/utils/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Placeholder Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Settings</Text>
    </View>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="MyTrips"
        component={MyTripsScreen}
        options={{
          tabBarLabel: "My Trips",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🚂</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="PNR"
        component={PNRStatusScreen}
        options={{
          tabBarLabel: "PNR Status",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🎫</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: colors.primary,
                background: colors.background,
                card: colors.cardBackground,
                text: colors.textPrimary,
                border: colors.border,
                notification: colors.primary,
              },
            }}
          >
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="Main" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
});
