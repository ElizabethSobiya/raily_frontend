import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "../src/store/themeStore";

export default function RootLayout() {
  const { colors } = useThemeStore();

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
