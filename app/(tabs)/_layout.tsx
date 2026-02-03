import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../src/store/themeStore";

function ThemeToggle() {
  const { mode, toggleTheme, colors } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.surfaceSecondary,
      }}
    >
      <Ionicons
        name={mode === "light" ? "moon-outline" : "sunny-outline"}
        size={22}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { colors } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Trips",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="train-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="pnr"
        options={{
          title: "PNR Status",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
