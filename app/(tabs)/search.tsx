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
import trainService from "../../src/services/trainService";
import { TrainSearchResult } from "../../src/types";
import { useThemeStore } from "../../src/store/themeStore";

const popularRoutes = [
  { from: "NDLS", to: "BCT", fromName: "New Delhi", toName: "Mumbai" },
  { from: "NDLS", to: "HWH", fromName: "New Delhi", toName: "Howrah" },
  { from: "BCT", to: "ADI", fromName: "Mumbai", toName: "Ahmedabad" },
  { from: "MAS", to: "SBC", fromName: "Chennai", toName: "Bangalore" },
];

interface TrainResult extends TrainSearchResult {
  availability?: Record<string, string>;
  days?: string;
}

// Helper to convert running days array to readable string
const formatRunningDays = (days: number[]): string => {
  if (days.length === 7) return "Daily";
  if (days.length === 6 && !days.includes(0)) return "Except Sun";
  if (days.length === 6 && !days.includes(6)) return "Except Sat";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map(d => dayNames[d]).join(", ");
};

export default function SearchScreen() {
  const { colors } = useThemeStore();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [trains, setTrains] = useState<TrainResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!fromStation || !toStation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await trainService.getTrainsBetween(
        fromStation.toUpperCase(),
        toStation.toUpperCase(),
        date
      );

      if (response.success && response.data) {
        // Transform the data and add mock availability for demo
        const trainsWithAvailability: TrainResult[] = response.data.map(train => ({
          ...train,
          availability: train.classes?.reduce((acc, cls) => {
            // Mock availability for demo
            const statuses = ["AVL 45", "AVL 23", "RAC 5", "WL 12"];
            acc[cls] = statuses[Math.floor(Math.random() * statuses.length)];
            return acc;
          }, {} as Record<string, string>),
          days: formatRunningDays(train.runningDays),
        }));
        setTrains(trainsWithAvailability);
        setShowResults(true);
      } else {
        setError("No trains found for this route");
        setTrains([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search trains. Please try again.");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  }, [fromStation, toStation, date]);

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const getAvailabilityColor = (status: string) => {
    if (status.includes("AVL")) return colors.success;
    if (status.includes("RAC")) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Form */}
        <View style={[styles.searchForm, { backgroundColor: colors.surface }]}>
          <View style={styles.stationInputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>From</Text>
              <TextInput
                style={[styles.stationInput, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                value={fromStation}
                onChangeText={setFromStation}
                placeholder="Enter station code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity style={[styles.swapButton, { backgroundColor: colors.surfaceSecondary }]} onPress={handleSwapStations}>
              <Ionicons name="swap-vertical" size={20} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>To</Text>
              <TextInput
                style={[styles.stationInput, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                value={toStation}
                onChangeText={setToStation}
                placeholder="Enter station code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={[styles.dateContainer, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.dateInput, { color: colors.text }]}
              value={date}
              onChangeText={setDate}
              placeholder="Select date"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }, (!fromStation || !toStation) && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!fromStation || !toStation || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={colors.background} />
                <Text style={[styles.searchButtonText, { color: colors.background }]}>Search Trains</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Popular Routes */}
        {!showResults && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Routes</Text>
            <View style={styles.popularRoutes}>
              {popularRoutes.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.routeChip, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={() => {
                    setFromStation(route.from);
                    setToStation(route.to);
                  }}
                >
                  <Text style={[styles.routeText, { color: colors.text }]}>
                    {route.from} → {route.to}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {showResults && (
          <View style={styles.section}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {fromStation.toUpperCase()} → {toStation.toUpperCase()}
              </Text>
              <Text style={[styles.resultsCount, { color: colors.textMuted }]}>{trains.length} trains found</Text>
            </View>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            {trains.length === 0 && !error ? (
              <View style={styles.emptyState}>
                <Ionicons name="train-outline" size={48} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.text }]}>No trains found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Try different stations or date</Text>
              </View>
            ) : (
              trains.map((train) => (
                <TouchableOpacity key={train.trainNumber} style={[styles.trainCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.trainHeader}>
                    <View>
                      <Text style={[styles.trainNumber, { color: colors.text }]}>{train.trainNumber}</Text>
                      <Text style={[styles.trainName, { color: colors.textMuted }]}>{train.trainName}</Text>
                    </View>
                    <View style={[styles.daysBadge, { backgroundColor: colors.surfaceSecondary }]}>
                      <Text style={[styles.daysText, { color: colors.textMuted }]}>{train.days || "Daily"}</Text>
                    </View>
                  </View>

                  <View style={styles.trainRoute}>
                    <View style={styles.timeBlock}>
                      <Text style={[styles.trainTime, { color: colors.text }]}>{train.departureTime}</Text>
                      <Text style={[styles.stationCode, { color: colors.textMuted }]}>{fromStation.toUpperCase()}</Text>
                    </View>

                    <View style={styles.durationBlock}>
                      <Text style={[styles.duration, { color: colors.textMuted }]}>{train.duration}</Text>
                      <View style={[styles.durationLine, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={[styles.timeBlock, styles.timeBlockRight]}>
                      <Text style={[styles.trainTime, { color: colors.text }]}>{train.arrivalTime}</Text>
                      <Text style={[styles.stationCode, { color: colors.textMuted }]}>{toStation.toUpperCase()}</Text>
                    </View>
                  </View>

                  {train.classes && train.classes.length > 0 && (
                    <View style={[styles.classesContainer, { borderTopColor: colors.surfaceSecondary }]}>
                      {train.classes.map((cls) => (
                        <View key={cls} style={[styles.classItem, { backgroundColor: colors.surfaceSecondary }]}>
                          <Text style={[styles.className, { color: colors.text }]}>{cls}</Text>
                          {train.availability && train.availability[cls] && (
                            <Text
                              style={[
                                styles.availability,
                                { color: getAvailabilityColor(train.availability[cls]) },
                              ]}
                            >
                              {train.availability[cls]}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
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
  },
  searchForm: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginTop: 8,
  },
  stationInputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  stationInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: "monospace",
  },
  swapButton: {
    position: "absolute",
    right: 0,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  popularRoutes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  routeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  routeText: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
  },
  trainCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  trainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  trainNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  trainName: {
    fontSize: 12,
    marginTop: 2,
  },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  daysText: {
    fontSize: 10,
    fontWeight: "600",
  },
  trainRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: "flex-end",
  },
  trainTime: {
    fontSize: 20,
    fontWeight: "bold",
  },
  stationCode: {
    fontSize: 12,
    fontFamily: "monospace",
    marginTop: 2,
  },
  durationBlock: {
    flex: 1,
    alignItems: "center",
  },
  duration: {
    fontSize: 12,
    marginBottom: 6,
  },
  durationLine: {
    width: "80%",
    height: 2,
  },
  classesContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  classItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  className: {
    fontSize: 12,
    fontWeight: "bold",
  },
  availability: {
    fontSize: 10,
    marginTop: 2,
  },
  // Error and empty states
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
