import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/themeStore";

export default function SettingsScreen() {
  const { colors, mode, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [delayAlerts, setDelayAlerts] = useState(true);
  const [platformAlerts, setPlatformAlerts] = useState(false);
  const [arrivalReminders, setArrivalReminders] = useState(true);

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
    showArrow,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    showArrow?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.surfaceSecondary }]}
      onPress={onPress}
      disabled={!onPress && !showArrow}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.surfaceSecondary }]}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
      {onToggle !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + "50" }}
          thumbColor={value ? colors.primary : colors.textMuted}
        />
      )}
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Guest User</Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>Tap to sign in</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Notifications</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Enable all notifications"
              value={notifications}
              onToggle={setNotifications}
            />
            <SettingItem
              icon="alert-circle-outline"
              title="Delay Alerts"
              subtitle="Get notified when your train is delayed"
              value={delayAlerts}
              onToggle={setDelayAlerts}
            />
            <SettingItem
              icon="location-outline"
              title="Platform Changes"
              subtitle="Notify about platform changes"
              value={platformAlerts}
              onToggle={setPlatformAlerts}
            />
            <SettingItem
              icon="time-outline"
              title="Arrival Reminders"
              subtitle="30 min and 10 min before arrival"
              value={arrivalReminders}
              onToggle={setArrivalReminders}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Preferences</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle="English"
              showArrow
              onPress={() => {}}
            />
            <TouchableOpacity
              style={[styles.settingItem, { borderBottomColor: colors.surfaceSecondary }]}
              onPress={toggleTheme}
            >
              <View style={[styles.settingIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name={mode === "light" ? "sunny-outline" : "moon-outline"} size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  {mode === "light" ? "Light Mode" : "Dark Mode"}
                </Text>
              </View>
              <View style={[styles.themeBadge, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons
                  name={mode === "light" ? "sunny" : "moon"}
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.themeBadgeText, { color: colors.primary }]}>
                  {mode === "light" ? "Light" : "Dark"}
                </Text>
              </View>
            </TouchableOpacity>
            <SettingItem
              icon="speedometer-outline"
              title="Distance Unit"
              subtitle="Kilometers"
              showArrow
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Data & Storage</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <SettingItem
              icon="cloud-download-outline"
              title="Offline Mode"
              subtitle="Download schedules for offline use"
              showArrow
              onPress={() => {}}
            />
            <SettingItem
              icon="trash-outline"
              title="Clear Cache"
              subtitle="Free up storage space"
              showArrow
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Support</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              showArrow
              onPress={() => {}}
            />
            <SettingItem
              icon="chatbubble-outline"
              title="Contact Us"
              showArrow
              onPress={() => {}}
            />
            <SettingItem
              icon="star-outline"
              title="Rate the App"
              showArrow
              onPress={() => {}}
            />
            <SettingItem
              icon="document-text-outline"
              title="Privacy Policy"
              showArrow
              onPress={() => {}}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Terms of Service"
              showArrow
              onPress={() => {}}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: colors.primary }]}>RailTrack India</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
          <Text style={[styles.copyright, { color: colors.border }]}>Made with love in India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    marginLeft: 14,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  themeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  themeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 100,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
  copyright: {
    fontSize: 12,
    marginTop: 8,
  },
});
