import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JourneyCard } from "../components/journey";
import { TripCardSkeleton } from "../components/common";
import { useTripStore } from "../store/tripStore";
import { colors, spacing, typography, borderRadius } from "../utils/theme";
import { Trip } from "../types";

type TabType = "upcoming" | "past";

export function MyTripsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  const {
    upcomingTrips,
    pastTrips,
    isLoading,
    error,
    fetchUpcomingTrips,
    fetchPastTrips,
  } = useTripStore();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    await Promise.all([fetchUpcomingTrips(), fetchPastTrips()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const trips = activeTab === "upcoming" ? upcomingTrips : pastTrips;

  const handleTripPress = (trip: Trip) => {
    if (trip.isLive) {
      navigation.navigate("LiveJourney", { tripId: trip.id });
    } else {
      navigation.navigate("TripDetails", { tripId: trip.id });
    }
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <JourneyCard
      trip={item}
      onPress={() => handleTripPress(item)}
      isLive={item.isLive}
      progress={item.isLive ? 45 : undefined} // Would come from live status
      delayMinutes={0} // Would come from live status
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {activeTab === "upcoming" ? "No upcoming trips" : "No past trips"}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === "upcoming"
          ? "Add a trip using the + button or check PNR status"
          : "Your completed trips will appear here"}
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((i) => (
        <TripCardSkeleton key={i} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTrip")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.tabActive]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.tabTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading && !refreshing ? (
        renderLoading()
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  title: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    fontSize: typography.fontSize.xxl,
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },

  tabs: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },

  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },

  tabActive: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },

  tabTextActive: {
    color: colors.background,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  loadingContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xxxl * 2,
  },

  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
});

export default MyTripsScreen;
