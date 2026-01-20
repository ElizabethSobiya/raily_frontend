import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, typography, borderRadius } from "../../utils/theme";
import { TrainStop } from "../../types";

interface StationTimelineProps {
  stops: TrainStop[];
  currentStopIndex?: number;
  completedStops?: number[];
}

export function StationTimeline({
  stops,
  currentStopIndex = -1,
  completedStops = [],
}: StationTimelineProps) {
  const isCompleted = (index: number) => completedStops.includes(index) || index < currentStopIndex;
  const isCurrent = (index: number) => index === currentStopIndex;
  const isUpcoming = (index: number) => index > currentStopIndex && currentStopIndex >= 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {stops.map((stop, index) => {
        const completed = isCompleted(index);
        const current = isCurrent(index);
        const upcoming = isUpcoming(index);
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;

        return (
          <View key={stop.stationCode} style={styles.stopRow}>
            {/* Timeline */}
            <View style={styles.timeline}>
              {/* Line above */}
              {!isFirst && (
                <View
                  style={[
                    styles.line,
                    completed && styles.lineCompleted,
                    current && styles.lineCurrent,
                  ]}
                />
              )}

              {/* Dot */}
              <View
                style={[
                  styles.dot,
                  completed && styles.dotCompleted,
                  current && styles.dotCurrent,
                  upcoming && styles.dotUpcoming,
                  (isFirst || isLast) && styles.dotTerminal,
                ]}
              >
                {completed && <Text style={styles.checkmark}>✓</Text>}
                {current && <View style={styles.currentDotInner} />}
              </View>

              {/* Line below */}
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    completed && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Station info */}
            <View style={[styles.stationInfo, current && styles.stationInfoCurrent]}>
              <View style={styles.stationHeader}>
                <Text
                  style={[
                    styles.stationCode,
                    completed && styles.textCompleted,
                    current && styles.textCurrent,
                  ]}
                >
                  {stop.stationCode}
                </Text>
                {stop.platform && (
                  <Text style={styles.platform}>PF {stop.platform}</Text>
                )}
              </View>

              <Text
                style={[
                  styles.stationName,
                  completed && styles.textCompleted,
                  current && styles.textCurrent,
                ]}
              >
                {stop.stationName}
              </Text>

              <View style={styles.times}>
                {stop.arrivalTime && (
                  <Text style={[styles.time, completed && styles.timeCompleted]}>
                    Arr: {stop.arrivalTime}
                  </Text>
                )}
                {stop.departureTime && (
                  <Text style={[styles.time, completed && styles.timeCompleted]}>
                    Dep: {stop.departureTime}
                  </Text>
                )}
                {stop.haltMinutes > 0 && (
                  <Text style={styles.halt}>{stop.haltMinutes}m halt</Text>
                )}
              </View>

              {stop.distanceKm > 0 && (
                <Text style={styles.distance}>{stop.distanceKm} km from source</Text>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  stopRow: {
    flexDirection: "row",
    minHeight: 80,
  },

  timeline: {
    width: 40,
    alignItems: "center",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },

  lineCompleted: {
    backgroundColor: colors.success,
  },

  lineCurrent: {
    backgroundColor: colors.primary,
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cardBackgroundLight,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  dotCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },

  dotCurrent: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 3,
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  dotUpcoming: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },

  dotTerminal: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  currentDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  checkmark: {
    fontSize: 10,
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },

  stationInfo: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg,
  },

  stationInfoCurrent: {
    backgroundColor: `${colors.primary}10`,
    marginLeft: spacing.sm,
    marginRight: -spacing.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },

  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  stationCode: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },

  platform: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },

  stationName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  times: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },

  time: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },

  timeCompleted: {
    color: colors.textMuted,
  },

  halt: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  distance: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  textCompleted: {
    color: colors.textMuted,
  },

  textCurrent: {
    color: colors.primary,
  },
});

export default StationTimeline;
