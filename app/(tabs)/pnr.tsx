import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import pnrService from "../../src/services/pnrService";
import { useThemeStore } from "../../src/store/themeStore";

interface PNRDisplayData {
  pnr: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  classType: string;
  chartStatus: string;
  passengers: Array<{
    name: string;
    age: number;
    status: string;
    coach: string;
    seat: string;
    gender: string;
  }>;
}

export default function PNRScreen() {
  const { colors } = useThemeStore();
  const [pnrNumber, setPnrNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [pnrData, setPnrData] = useState<PNRDisplayData | null>(null);
  const [error, setError] = useState("");

  const handleCheckPNR = useCallback(async () => {
    if (pnrNumber.length !== 10) {
      setError("Please enter a valid 10-digit PNR number");
      return;
    }

    setError("");
    setLoading(true);
    setPnrData(null);

    try {
      const response = await pnrService.getStatus(pnrNumber);

      if (response.success && response.data) {
        const data = response.data;
        // Transform API response to display format
        const displayData: PNRDisplayData = {
          pnr: data.pnr,
          trainNumber: data.trainNumber,
          trainName: data.trainName,
          journeyDate: data.journeyDate,
          from: data.boardingPoint,
          fromName: data.boardingPointName || data.boardingPoint,
          to: data.destination,
          toName: data.destinationName || data.destination,
          departureTime: "--:--", // PNR API doesn't return time
          arrivalTime: "--:--",
          classType: data.classType,
          chartStatus: data.chartPrepared ? "CHART PREPARED" : "CHART NOT PREPARED",
          passengers: data.passengers.map((p, i) => ({
            name: `Passenger ${p.number}`,
            age: 0, // Age not returned by API
            status: p.currentStatus.split("/")[0] || "N/A",
            coach: p.currentStatus.split("/")[1] || "--",
            seat: p.currentStatus.split("/")[2] || "--",
            gender: i % 2 === 0 ? "M" : "F", // Mock gender as API doesn't provide it
          })),
        };
        setPnrData(displayData);
      } else {
        setError("PNR not found or invalid");
      }
    } catch (err) {
      console.error("PNR check failed:", err);
      setError("Failed to fetch PNR status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pnrNumber]);

  const getStatusColor = (status: string) => {
    if (status.includes("CNF")) return colors.success;
    if (status.includes("RAC")) return colors.warning;
    if (status.includes("WL")) return colors.error;
    return colors.textMuted;
  };

  const getStatusBg = (status: string) => {
    if (status.includes("CNF")) return colors.success + "20";
    if (status.includes("RAC")) return colors.warning + "20";
    if (status.includes("WL")) return colors.error + "20";
    return colors.textMuted + "20";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* PNR Input */}
        <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Enter PNR Number</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.pnrInput, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
              value={pnrNumber}
              onChangeText={(text) => {
                setPnrNumber(text.replace(/[^0-9]/g, "").slice(0, 10));
                setError("");
              }}
              placeholder="10-digit PNR"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.checkButton, { backgroundColor: colors.primary }, pnrNumber.length !== 10 && styles.checkButtonDisabled]}
              onPress={handleCheckPNR}
              disabled={pnrNumber.length !== 10 || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Ionicons name="search" size={24} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
        </View>

        {/* Recent PNRs */}
        {!pnrData && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
            <View style={[styles.recentList, { backgroundColor: colors.surface }]}>
              {["4521678903", "7896541230", "1234567890"].map((pnr) => (
                <TouchableOpacity
                  key={pnr}
                  style={[styles.recentItem, { borderBottomColor: colors.surfaceSecondary }]}
                  onPress={() => setPnrNumber(pnr)}
                >
                  <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                  <Text style={[styles.recentPNR, { color: colors.text }]}>{pnr}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* PNR Results */}
        {pnrData && (
          <View style={styles.resultsContainer}>
            {/* Train Info Card */}
            <View style={[styles.trainCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.pnrBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.pnrLabel, { color: colors.primary }]}>PNR</Text>
                <Text style={[styles.pnrValue, { color: colors.primary }]}>{pnrData.pnr}</Text>
              </View>

              <View style={styles.trainInfo}>
                <Text style={[styles.trainNumber, { color: colors.text }]}>{pnrData.trainNumber}</Text>
                <Text style={[styles.trainName, { color: colors.textMuted }]}>{pnrData.trainName}</Text>
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.stationInfo}>
                  <Text style={[styles.stationCode, { color: colors.text }]}>{pnrData.from}</Text>
                  <Text style={[styles.stationName, { color: colors.textMuted }]}>{pnrData.fromName}</Text>
                  <Text style={[styles.time, { color: colors.textMuted }]}>{pnrData.departureTime}</Text>
                </View>

                <View style={styles.routeLine}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.line, { backgroundColor: colors.border }]} />
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                </View>

                <View style={[styles.stationInfo, styles.stationInfoRight]}>
                  <Text style={[styles.stationCode, { color: colors.text }]}>{pnrData.to}</Text>
                  <Text style={[styles.stationName, { color: colors.textMuted }]}>{pnrData.toName}</Text>
                  <Text style={[styles.time, { color: colors.textMuted }]}>{pnrData.arrivalTime}</Text>
                </View>
              </View>

              <View style={[styles.journeyMeta, { borderTopColor: colors.surfaceSecondary }]}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{pnrData.journeyDate}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.classLabel, { color: colors.text, backgroundColor: colors.surfaceSecondary }]}>{pnrData.classType}</Text>
                </View>
                <View style={[styles.chartBadge, { backgroundColor: pnrData.chartStatus.includes("PREPARED") ? colors.success + "20" : colors.warning + "20" }]}>
                  <Text style={[styles.chartText, { color: pnrData.chartStatus.includes("PREPARED") ? colors.success : colors.warning }]}>
                    {pnrData.chartStatus}
                  </Text>
                </View>
              </View>
            </View>

            {/* Passengers */}
            <View style={[styles.passengersCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.passengerTitle, { color: colors.text }]}>Passengers</Text>
              {pnrData.passengers.map((passenger, index) => (
                <View key={index} style={[styles.passengerItem, { borderBottomColor: colors.surfaceSecondary }]}>
                  <View style={styles.passengerInfo}>
                    <View style={[styles.passengerAvatar, { backgroundColor: colors.surfaceSecondary }]}>
                      <Ionicons
                        name={passenger.gender === "M" ? "man" : "woman"}
                        size={20}
                        color={colors.textMuted}
                      />
                    </View>
                    <View>
                      <Text style={[styles.passengerName, { color: colors.text }]}>{passenger.name}</Text>
                      <Text style={[styles.passengerAge, { color: colors.textMuted }]}>{passenger.age} yrs</Text>
                    </View>
                  </View>

                  <View style={styles.seatInfo}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(passenger.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(passenger.status) }]}>
                        {passenger.status}
                      </Text>
                    </View>
                    <Text style={[styles.seatText, { color: colors.textMuted }]}>
                      {passenger.coach} / {passenger.seat}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={[styles.actionsContainer, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.textMuted }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.textMuted }]}>Add to Trips</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="refresh-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.textMuted }]}>Refresh</Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  inputCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  pnrInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  checkButton: {
    borderRadius: 12,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  recentList: {
    borderRadius: 16,
    overflow: "hidden",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  recentPNR: {
    flex: 1,
    fontSize: 16,
    fontFamily: "monospace",
  },
  resultsContainer: {
    gap: 16,
    paddingBottom: 100,
  },
  trainCard: {
    borderRadius: 16,
    padding: 20,
  },
  pnrBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  pnrLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  pnrValue: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  trainInfo: {
    marginBottom: 20,
  },
  trainNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  trainName: {
    fontSize: 14,
    marginTop: 4,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stationInfo: {
    flex: 1,
  },
  stationInfoRight: {
    alignItems: "flex-end",
  },
  stationCode: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  stationName: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    marginTop: 4,
  },
  routeLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    flex: 1,
    height: 2,
  },
  journeyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  classLabel: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chartBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: "auto",
  },
  chartText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  passengersCard: {
    borderRadius: 16,
    padding: 20,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  passengerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  passengerAge: {
    fontSize: 12,
  },
  seatInfo: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  seatText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    padding: 16,
  },
  actionButton: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 12,
  },
});
