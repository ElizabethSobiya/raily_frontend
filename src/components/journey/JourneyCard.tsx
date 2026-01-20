import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, ProgressBar, StatusIndicator, Badge } from "../common";
import { colors, spacing, typography, borderRadius } from "../../utils/theme";
import { Trip } from "../../types";
import { format, parseISO } from "date-fns";

interface JourneyCardProps {
  trip: Trip;
  onPress: () => void;
  isLive?: boolean;
  progress?: number;
  delayMinutes?: number;
  nextStation?: string;
  eta?: string;
}

export function JourneyCard({
  trip,
  onPress,
  isLive = false,
  progress = 0,
  delayMinutes = 0,
  nextStation,
  eta,
}: JourneyCardProps) {
  const journeyDate = parseISO(trip.journeyDate);

  const getStatus = (): "on_time" | "delayed" | "cancelled" => {
    if (trip.status === "cancelled") return "cancelled";
    if (delayMinutes > 0) return "delayed";
    return "on_time";
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.trainInfo}>
          <Text style={styles.trainNumber}>{trip.trainNumber}</Text>
          <Text style={styles.trainName}>{trip.trainName}</Text>
        </View>
        <StatusIndicator
          status={getStatus()}
          delayMinutes={delayMinutes}
          size="sm"
        />
      </View>

      {/* Route */}
      <View style={styles.route}>
        <View style={styles.station}>
          <Text style={styles.stationCode}>{trip.sourceStation}</Text>
          <Text style={styles.stationTime}>{trip.departureTime || "--:--"}</Text>
        </View>

        <View style={styles.routeLine}>
          <View style={styles.line} />
          <Text style={styles.duration}>
            {format(journeyDate, "dd MMM")}
          </Text>
        </View>

        <View style={[styles.station, styles.stationRight]}>
          <Text style={styles.stationCode}>{trip.destinationStation}</Text>
          <Text style={styles.stationTime}>{trip.arrivalTime || "--:--"}</Text>
        </View>
      </View>

      {/* Progress bar for live trips */}
      {isLive && (
        <View style={styles.progressSection}>
          <ProgressBar progress={progress} height={6} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{progress}% completed</Text>
            {nextStation && (
              <Text style={styles.nextStation}>
                Next: {nextStation} {eta && `(${eta})`}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Footer info */}
      <View style={styles.footer}>
        {trip.pnr && (
          <Badge label={`PNR: ${trip.pnr}`} variant="default" size="sm" />
        )}
        {trip.coach && trip.seatBerth && (
          <Badge
            label={`${trip.coach}/${trip.seatBerth}`}
            variant="info"
            size="sm"
          />
        )}
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },

  trainInfo: {
    flex: 1,
  },

  trainNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  trainName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  route: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  station: {
    alignItems: "flex-start",
  },

  stationRight: {
    alignItems: "flex-end",
  },

  stationCode: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },

  stationTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  routeLine: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  line: {
    height: 2,
    width: "100%",
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },

  duration: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  progressSection: {
    marginBottom: spacing.md,
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },

  progressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },

  nextStation: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: spacing.xs,
  },

  liveText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
});

export default JourneyCard;
