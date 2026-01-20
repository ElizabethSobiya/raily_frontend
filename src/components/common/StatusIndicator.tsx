import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../utils/theme";

interface StatusIndicatorProps {
  status: "on_time" | "delayed" | "cancelled" | "arrived" | "departed";
  delayMinutes?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  style?: ViewStyle;
}

const statusConfig = {
  on_time: {
    color: colors.success,
    label: "On Time",
    bgColor: `${colors.success}20`,
  },
  delayed: {
    color: colors.warning,
    label: "Delayed",
    bgColor: `${colors.warning}20`,
  },
  cancelled: {
    color: colors.error,
    label: "Cancelled",
    bgColor: `${colors.error}20`,
  },
  arrived: {
    color: colors.success,
    label: "Arrived",
    bgColor: `${colors.success}20`,
  },
  departed: {
    color: colors.info,
    label: "Departed",
    bgColor: `${colors.info}20`,
  },
};

export function StatusIndicator({
  status,
  delayMinutes,
  size = "md",
  showLabel = true,
  style,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  const formatDelay = () => {
    if (!delayMinutes || delayMinutes <= 0) return "";
    if (delayMinutes >= 60) {
      const hours = Math.floor(delayMinutes / 60);
      const mins = delayMinutes % 60;
      return `+${hours}h ${mins}m`;
    }
    return `+${delayMinutes}m`;
  };

  const displayLabel = status === "delayed" && delayMinutes ? formatDelay() : config.label;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bgColor },
        styles[`size_${size}`],
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      {showLabel && (
        <Text style={[styles.label, { color: config.color }, styles[`text_${size}`]]}>
          {displayLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },

  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  size_md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  size_lg: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  label: {
    fontWeight: typography.fontWeight.medium,
  },

  text_sm: {
    fontSize: typography.fontSize.xs,
  },
  text_md: {
    fontSize: typography.fontSize.sm,
  },
  text_lg: {
    fontSize: typography.fontSize.md,
  },
});

export default StatusIndicator;
