import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";
import { colors, borderRadius } from "../../utils/theme";

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Preset skeleton patterns
export function CardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <LoadingSkeleton width={120} height={16} />
        <LoadingSkeleton width={80} height={24} />
      </View>
      <LoadingSkeleton width="100%" height={12} style={styles.marginTop} />
      <LoadingSkeleton width="70%" height={12} style={styles.marginTop} />
      <View style={styles.cardFooter}>
        <LoadingSkeleton width={100} height={32} borderRadius={borderRadius.md} />
        <LoadingSkeleton width={100} height={32} borderRadius={borderRadius.md} />
      </View>
    </View>
  );
}

export function TripCardSkeleton() {
  return (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <LoadingSkeleton width={150} height={18} />
        <LoadingSkeleton width={80} height={24} borderRadius={borderRadius.full} />
      </View>
      <View style={styles.tripRoute}>
        <View style={styles.tripStation}>
          <LoadingSkeleton width={50} height={24} />
          <LoadingSkeleton width={80} height={14} style={styles.marginTopSm} />
        </View>
        <LoadingSkeleton width={60} height={4} />
        <View style={styles.tripStation}>
          <LoadingSkeleton width={50} height={24} />
          <LoadingSkeleton width={80} height={14} style={styles.marginTopSm} />
        </View>
      </View>
      <LoadingSkeleton width="100%" height={8} style={styles.marginTop} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.cardBackgroundLight,
  },

  cardContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  marginTop: {
    marginTop: 12,
  },

  marginTopSm: {
    marginTop: 4,
  },

  tripCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: 16,
  },

  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tripRoute: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  tripStation: {
    alignItems: "center",
  },
});

export default LoadingSkeleton;
