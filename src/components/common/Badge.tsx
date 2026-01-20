import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../utils/theme";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  style?: ViewStyle;
}

export function Badge({ label, variant = "default", size = "md", style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },

  // Size
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  size_md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },

  // Variants
  success: {
    backgroundColor: `${colors.success}20`,
  },
  warning: {
    backgroundColor: `${colors.warning}20`,
  },
  error: {
    backgroundColor: `${colors.error}20`,
  },
  info: {
    backgroundColor: `${colors.info}20`,
  },
  default: {
    backgroundColor: colors.cardBackgroundLight,
  },

  // Text styles
  text: {
    fontWeight: typography.fontWeight.medium,
  },
  text_success: {
    color: colors.success,
  },
  text_warning: {
    color: colors.warning,
  },
  text_error: {
    color: colors.error,
  },
  text_info: {
    color: colors.info,
  },
  text_default: {
    color: colors.textSecondary,
  },

  textSize_sm: {
    fontSize: typography.fontSize.xs,
  },
  textSize_md: {
    fontSize: typography.fontSize.sm,
  },
});

export default Badge;
