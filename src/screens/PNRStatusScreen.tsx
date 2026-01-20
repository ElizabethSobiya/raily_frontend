import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button, Badge } from "../components/common";
import { pnrService, parseBookingStatus } from "../services/pnrService";
import { colors, spacing, typography, borderRadius } from "../utils/theme";
import { PNRStatus, Passenger } from "../types";

export function PNRStatusScreen() {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pnrData, setPnrData] = useState<PNRStatus | null>(null);

  const handleCheckPNR = async () => {
    if (pnr.length !== 10) {
      setError("Please enter a valid 10-digit PNR number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await pnrService.getStatus(pnr);
      if (response.success) {
        setPnrData(response.data);
      } else {
        setError(response.error || "Failed to fetch PNR status");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch PNR status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "error" | "default" => {
    const parsed = parseBookingStatus(status);
    switch (parsed.status) {
      case "CNF":
        return "success";
      case "RAC":
        return "warning";
      case "WL":
        return "error";
      default:
        return "default";
    }
  };

  const renderPassenger = (passenger: Passenger, index: number) => {
    const parsed = parseBookingStatus(passenger.currentStatus);

    return (
      <View key={index} style={styles.passengerRow}>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerNumber}>Passenger {passenger.number}</Text>
          <Badge
            label={passenger.currentStatus}
            variant={getStatusBadgeVariant(passenger.currentStatus)}
          />
        </View>
        <View style={styles.passengerStatus}>
          <Text style={styles.bookingLabel}>Booking Status</Text>
          <Text style={styles.bookingStatus}>{passenger.bookingStatus}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PNR Status</Text>
          <Text style={styles.subtitle}>
            Enter your 10-digit PNR number to check booking status
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter PNR Number"
            placeholderTextColor={colors.textMuted}
            value={pnr}
            onChangeText={(text) => {
              setPnr(text.replace(/\D/g, "").slice(0, 10));
              setError(null);
            }}
            keyboardType="number-pad"
            maxLength={10}
          />
          <Button
            title={loading ? "" : "Check Status"}
            onPress={handleCheckPNR}
            disabled={pnr.length !== 10 || loading}
            loading={loading}
            fullWidth
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* PNR Result */}
        {pnrData && (
          <View style={styles.resultSection}>
            {/* Train Info Card */}
            <Card style={styles.trainCard}>
              <View style={styles.trainHeader}>
                <View>
                  <Text style={styles.trainNumber}>{pnrData.trainNumber}</Text>
                  <Text style={styles.trainName}>{pnrData.trainName}</Text>
                </View>
                <Badge
                  label={pnrData.chartPrepared ? "Chart Prepared" : "Chart Not Prepared"}
                  variant={pnrData.chartPrepared ? "success" : "warning"}
                />
              </View>

              <View style={styles.journeyInfo}>
                <View style={styles.stationInfo}>
                  <Text style={styles.stationCode}>{pnrData.boardingPoint}</Text>
                  <Text style={styles.stationName}>{pnrData.boardingPointName}</Text>
                </View>
                <View style={styles.arrow}>
                  <Text style={styles.arrowText}>→</Text>
                  <Text style={styles.dateText}>{pnrData.journeyDate}</Text>
                </View>
                <View style={[styles.stationInfo, styles.stationInfoRight]}>
                  <Text style={styles.stationCode}>{pnrData.destination}</Text>
                  <Text style={styles.stationName}>{pnrData.destinationName}</Text>
                </View>
              </View>

              <View style={styles.classInfo}>
                <Badge label={`Class: ${pnrData.classType}`} variant="info" />
                <Text style={styles.pnrText}>PNR: {pnrData.pnr}</Text>
              </View>
            </Card>

            {/* Passengers Card */}
            <Card style={styles.passengersCard}>
              <Text style={styles.sectionTitle}>Passengers</Text>
              {pnrData.passengers.map(renderPassenger)}
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Add to My Trips</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  title: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  inputSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
    textAlign: "center",
    letterSpacing: 4,
  },

  errorContainer: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: `${colors.error}20`,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },

  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: "center",
  },

  resultSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  trainCard: {
    marginBottom: 0,
  },

  trainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },

  trainNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  trainName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  journeyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  stationInfo: {
    flex: 1,
  },

  stationInfoRight: {
    alignItems: "flex-end",
  },

  stationCode: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },

  stationName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  arrow: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  arrowText: {
    fontSize: typography.fontSize.xl,
    color: colors.primary,
  },

  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pnrText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.mono,
  },

  passengersCard: {
    marginBottom: 0,
  },

  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  passengerRow: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  passengerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  passengerNumber: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },

  passengerStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bookingLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },

  bookingStatus: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.mono,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },

  actionButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },

  actionText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default PNRStatusScreen;
