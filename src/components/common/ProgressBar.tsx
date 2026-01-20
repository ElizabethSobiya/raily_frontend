import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, borderRadius } from "../../utils/theme";

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  backgroundColor = colors.cardBackgroundLight,
  progressColor = colors.primary,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
});

export default ProgressBar;
