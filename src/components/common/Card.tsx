import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../../utils/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  onPress?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  style,
  variant = "default",
  onPress,
  padding = "md",
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    padding !== "none" && styles[`padding_${padding}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },

  // Variants
  default: {
    backgroundColor: colors.cardBackground,
  },
  elevated: {
    backgroundColor: colors.cardBackground,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Padding
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.lg,
  },
  padding_lg: {
    padding: spacing.xl,
  },
});

export default Card;
