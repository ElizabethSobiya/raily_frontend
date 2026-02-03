import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import trainService from "../../src/services/trainService";
import { LiveTrainStatus } from "../../src/types";
import { useThemeStore } from "../../src/store/themeStore";

interface TripData {
  id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  sourceName: string;
  destination: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  status: string;
  pnr: string;
  coach: string;
  seat: string;
  isLive: boolean;
  progress: number;
  delay: number;
  currentStation?: string;
  nextStation?: string;
}

// Demo trips - in a real app, these would come from user's saved trips
const demoTrips: TripData[] = [
  {
    id: "1",
    trainNumber: "12002",
    trainName: "BHOPAL SHATABDI",
    source: "NDLS",
    sourceName: "New Delhi",
    destination: "BPL",
    destinationName: "Bhopal Jn",
    departureTime: "06:00",
    arrivalTime: "13:35",
    date: new Date().toISOString().split("T")[0],
    status: "confirmed",
    pnr: "1234567890",
    coach: "C2",
    seat: "45",
    isLive: true,
    progress: 0,
    delay: 0,
  },
  {
    id: "2",
    trainNumber: "12951",
    trainName: "MUMBAI RAJDHANI",
    source: "NDLS",
    sourceName: "New Delhi",
    destination: "BCT",
    destinationName: "Mumbai Central",
    departureTime: "16:25",
    arrivalTime: "08:15",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "confirmed",
    pnr: "9876543210",
    coach: "B2",
    seat: "32",
    isLive: false,
    progress: 0,
    delay: 0,
  },
];

export default function MyTripsScreen() {
  const { colors } = useThemeStore();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripData[]>(demoTrips);
  const [liveStatuses, setLiveStatuses] = useState<Record<string, LiveTrainStatus>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchLiveStatus = useCallback(async (trainNumber: string, date: string) => {
    try {
      const response = await trainService.getLiveStatus(trainNumber, date);
      if (response.success && response.data) {
        setLiveStatuses(prev => ({
          ...prev,
          [trainNumber]: response.data
        }));
        return response.data;
      }
    } catch (err) {
      console.error(`Failed to fetch live status for ${trainNumber}:`, err);
    }
    return null;
  }, []);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch live status for all live trips
      const liveTrips = trips.filter(t => t.isLive);
      await Promise.all(
        liveTrips.map(trip => fetchLiveStatus(trip.trainNumber, trip.date))
      );
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError("Failed to fetch live data. Showing cached data.");
    } finally {
      setLoading(false);
    }
  }, [trips, fetchLiveStatus]);

  useEffect(() => {
    loadTrips();

    // Refresh live status every 2 minutes
    const interval = setInterval(() => {
      const liveTrips = trips.filter(t => t.isLive);
      liveTrips.forEach(trip => fetchLiveStatus(trip.trainNumber, trip.date));
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, [loadTrips]);

  // Merge live status with trip data
  const getEnrichedTrip = (trip: TripData) => {
    const liveStatus = liveStatuses[trip.trainNumber];
    if (liveStatus && trip.isLive) {
      return {
        ...trip,
        delay: liveStatus.delayMinutes,
        currentStation: liveStatus.currentStation,
        nextStation: liveStatus.nextStation,
        trainName: liveStatus.trainName || trip.trainName,
        // Calculate progress based on current station position (simplified)
        progress: liveStatus.status === "running" ? 65 :
                  liveStatus.status === "terminated" ? 100 : 0,
      };
    }
    return trip;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "rac":
        return colors.warning;
      case "waitlist":
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const renderLiveTrip = (trip: TripData) => {
    const enrichedTrip = getEnrichedTrip(trip);
    return (
      <View style={[styles.liveCard, { backgroundColor: colors.surface, borderColor: colors.primary + "30" }]} key={enrichedTrip.id}>
        <View style={styles.liveHeader}>
          <View style={[styles.liveBadge, { backgroundColor: colors.success + "20" }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.liveText, { color: colors.success }]}>LIVE</Text>
          </View>
          {enrichedTrip.delay > 0 && (
            <View style={[styles.delayBadge, { backgroundColor: colors.warning + "20" }]}>
              <Text style={[styles.delayText, { color: colors.warning }]}>+{enrichedTrip.delay}m late</Text>
            </View>
          )}
        </View>

        <View style={styles.trainInfo}>
          <Text style={[styles.trainNumber, { color: colors.text }]}>{enrichedTrip.trainNumber}</Text>
          <Text style={[styles.trainName, { color: colors.textMuted }]}>{enrichedTrip.trainName}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.stationBlock}>
            <Text style={[styles.stationCode, { color: colors.text }]}>{enrichedTrip.source}</Text>
            <Text style={[styles.stationName, { color: colors.textMuted }]}>{enrichedTrip.sourceName}</Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>{enrichedTrip.departureTime}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressLine, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: `${enrichedTrip.progress}%`, backgroundColor: colors.primary }]} />
              <View style={[styles.trainIcon, { left: `${enrichedTrip.progress}%` }]}>
                <Ionicons name="train" size={16} color={colors.primary} />
              </View>
            </View>
            <Text style={[styles.progressText, { color: colors.textMuted }]}>{enrichedTrip.progress}% completed</Text>
          </View>

          <View style={[styles.stationBlock, styles.stationBlockRight]}>
            <Text style={[styles.stationCode, { color: colors.text }]}>{enrichedTrip.destination}</Text>
            <Text style={[styles.stationName, { color: colors.textMuted }]}>{enrichedTrip.destinationName}</Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>{enrichedTrip.arrivalTime}</Text>
          </View>
        </View>

        <View style={[styles.nextStationContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={[styles.nextStationLabel, { color: colors.textMuted }]}>Next Station: </Text>
          <Text style={[styles.nextStationName, { color: colors.text }]}>{enrichedTrip.nextStation || "N/A"}</Text>
        </View>

        <TouchableOpacity style={[styles.trackButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.trackButtonText, { color: colors.background }]}>Track Journey</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.background} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderUpcomingTrip = (trip: TripData) => (
    <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.surface }]} key={trip.id}>
      <View style={styles.tripHeader}>
        <View>
          <Text style={[styles.tripTrainNumber, { color: colors.text }]}>{trip.trainNumber}</Text>
          <Text style={[styles.tripTrainName, { color: colors.textMuted }]}>{trip.trainName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
            {trip.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.tripRoute}>
        <View style={styles.tripStation}>
          <Text style={[styles.tripStationCode, { color: colors.text }]}>{trip.source}</Text>
          <Text style={[styles.tripTime, { color: colors.textMuted }]}>{trip.departureTime}</Text>
        </View>
        <View style={styles.tripLine}>
          <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
        </View>
        <View style={[styles.tripStation, styles.tripStationRight]}>
          <Text style={[styles.tripStationCode, { color: colors.text }]}>{trip.destination}</Text>
          <Text style={[styles.tripTime, { color: colors.textMuted }]}>{trip.arrivalTime}</Text>
        </View>
      </View>

      <View style={[styles.tripFooter, { borderTopColor: colors.surfaceSecondary }]}>
        <View style={styles.tripDate}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.tripDateText, { color: colors.textMuted }]}>{trip.date}</Text>
        </View>
        <View style={[styles.tripSeat, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.tripSeatText, { color: colors.text }]}>{trip.coach} | {trip.seat}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: colors.surfaceSecondary }, activeTab === "upcoming" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === "upcoming" && { color: colors.background }]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: colors.surfaceSecondary }, activeTab === "past" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === "past" && { color: colors.background }]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.warning + "20" }]}>
            <Ionicons name="warning" size={16} color={colors.warning} />
            <Text style={[styles.errorText, { color: colors.warning }]}>{error}</Text>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Fetching live data...</Text>
          </View>
        ) : activeTab === "upcoming" ? (
          <>
            {trips.filter(t => t.isLive).map(renderLiveTrip)}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Journeys</Text>
            {trips.filter(t => !t.isLive).length > 0 ? (
              trips.filter(t => !t.isLive).map(renderUpcomingTrip)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.text }]}>No upcoming trips</Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Add a trip to start tracking</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="train-outline" size={64} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No past trips</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Your completed journeys will appear here</Text>
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 16,
  },
  // Live Card Styles
  liveCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  liveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  delayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  delayText: {
    fontSize: 12,
    fontWeight: "600",
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
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stationBlock: {
    flex: 1,
  },
  stationBlockRight: {
    alignItems: "flex-end",
  },
  stationCode: {
    fontSize: 18,
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
  progressContainer: {
    flex: 2,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  progressLine: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  trainIcon: {
    position: "absolute",
    top: -6,
    marginLeft: -8,
  },
  progressText: {
    fontSize: 10,
    marginTop: 8,
  },
  nextStationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextStationLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
  nextStationName: {
    fontSize: 12,
    fontWeight: "600",
  },
  trackButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Trip Card Styles
  tripCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  tripTrainNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tripTrainName: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tripRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tripStation: {
    flex: 1,
  },
  tripStationRight: {
    alignItems: "flex-end",
  },
  tripStationCode: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  tripTime: {
    fontSize: 12,
    marginTop: 2,
  },
  tripLine: {
    flex: 1,
    alignItems: "center",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tripDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripDateText: {
    fontSize: 12,
  },
  tripSeat: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tripSeatText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  // Loading and error styles
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
});
