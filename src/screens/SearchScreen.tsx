import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Badge } from "../components/common";
import { trainService } from "../services/trainService";
import { stationService } from "../services/stationService";
import { colors, spacing, typography, borderRadius } from "../utils/theme";
import { TrainSearchResult, StationSearchResult } from "../types";
import { POPULAR_ROUTES, DAYS_OF_WEEK } from "../utils/constants";

export function SearchScreen({ navigation }: any) {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrainSearchResult[]>([]);
  const [showStationSearch, setShowStationSearch] = useState<"from" | "to" | null>(null);
  const [stationResults, setStationResults] = useState<StationSearchResult[]>([]);
  const [stationLoading, setStationLoading] = useState(false);

  const handleSearch = async () => {
    if (!fromStation || !toStation) return;

    setLoading(true);
    try {
      const response = await trainService.getTrainsBetween(
        fromStation.toUpperCase(),
        toStation.toUpperCase(),
        date
      );
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStationSearch = async (query: string) => {
    if (query.length < 2) {
      setStationResults([]);
      return;
    }

    setStationLoading(true);
    try {
      const response = await stationService.search(query);
      if (response.success) {
        setStationResults(response.data);
      }
    } catch (error) {
      console.error("Station search error:", error);
    } finally {
      setStationLoading(false);
    }
  };

  const selectStation = (station: StationSearchResult) => {
    if (showStationSearch === "from") {
      setFromStation(station.code);
    } else {
      setToStation(station.code);
    }
    setShowStationSearch(null);
    setStationResults([]);
  };

  const selectPopularRoute = (route: typeof POPULAR_ROUTES[number]) => {
    setFromStation(route.from);
    setToStation(route.to);
  };

  const formatDays = (days: number[]) => {
    if (days.length === 7) return "Daily";
    return days.map((d) => DAYS_OF_WEEK[d]).join(", ");
  };

  const renderTrainResult = ({ item }: { item: TrainSearchResult }) => (
    <Card
      onPress={() => navigation.navigate("TrainDetails", { trainNumber: item.trainNumber })}
      style={styles.trainCard}
    >
      <View style={styles.trainHeader}>
        <View>
          <Text style={styles.trainNumber}>{item.trainNumber}</Text>
          <Text style={styles.trainName}>{item.trainName}</Text>
        </View>
        <Badge label={item.trainType} variant="info" size="sm" />
      </View>

      <View style={styles.trainRoute}>
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{item.departureTime}</Text>
          <Text style={styles.station}>{item.sourceStation}</Text>
        </View>
        <View style={styles.durationInfo}>
          <Text style={styles.duration}>{item.duration}</Text>
          <View style={styles.durationLine} />
        </View>
        <View style={[styles.timeInfo, styles.timeInfoRight]}>
          <Text style={styles.time}>{item.arrivalTime}</Text>
          <Text style={styles.station}>{item.destinationStation}</Text>
        </View>
      </View>

      <View style={styles.trainFooter}>
        <Text style={styles.runningDays}>{formatDays(item.runningDays)}</Text>
        <View style={styles.classes}>
          {item.classes.slice(0, 4).map((cls) => (
            <Badge key={cls} label={cls} variant="default" size="sm" />
          ))}
        </View>
      </View>
    </Card>
  );

  const renderStationResult = ({ item }: { item: StationSearchResult }) => (
    <TouchableOpacity
      style={styles.stationResult}
      onPress={() => selectStation(item)}
    >
      <Text style={styles.stationCode}>{item.code}</Text>
      <Text style={styles.stationName}>{item.name}</Text>
      {item.city && <Text style={styles.stationCity}>{item.city}</Text>}
    </TouchableOpacity>
  );

  if (showStationSearch) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={() => setShowStationSearch(null)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.searchTitle}>
            Select {showStationSearch === "from" ? "Origin" : "Destination"}
          </Text>
        </View>

        <TextInput
          style={styles.stationInput}
          placeholder="Search station by name or code"
          placeholderTextColor={colors.textMuted}
          onChangeText={handleStationSearch}
          autoFocus
        />

        {stationLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={stationResults}
            keyExtractor={(item) => item.code}
            renderItem={renderStationResult}
            contentContainerStyle={styles.stationList}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Trains</Text>
      </View>

      {/* Search Form */}
      <View style={styles.searchForm}>
        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setShowStationSearch("from")}
        >
          <Text style={styles.inputLabel}>From</Text>
          <Text style={fromStation ? styles.inputValue : styles.inputPlaceholder}>
            {fromStation || "Select station"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setShowStationSearch("to")}
        >
          <Text style={styles.inputLabel}>To</Text>
          <Text style={toStation ? styles.inputValue : styles.inputPlaceholder}>
            {toStation || "Select station"}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, (!fromStation || !toStation) && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!fromStation || !toStation || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.searchButtonText}>Search Trains</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Popular Routes */}
      {results.length === 0 && !loading && (
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <View style={styles.popularRoutes}>
            {POPULAR_ROUTES.map((route) => (
              <TouchableOpacity
                key={`${route.from}-${route.to}`}
                style={styles.popularRoute}
                onPress={() => selectPopularRoute(route)}
              >
                <Text style={styles.popularRouteText}>
                  {route.from} → {route.to}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.trainNumber}
          renderItem={renderTrainResult}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  title: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  searchForm: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },

  inputField: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },

  inputLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  inputValue: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },

  inputPlaceholder: {
    fontSize: typography.fontSize.lg,
    color: colors.textMuted,
  },

  dateInput: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    padding: 0,
  },

  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.background,
  },

  popularSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },

  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  popularRoutes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  popularRoute: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },

  popularRouteText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },

  resultsList: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  trainCard: {
    marginBottom: spacing.md,
  },

  trainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  trainNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  trainName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  trainRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  timeInfo: {
    flex: 1,
  },

  timeInfoRight: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  station: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  durationInfo: {
    flex: 1,
    alignItems: "center",
  },

  duration: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  durationLine: {
    height: 2,
    width: "80%",
    backgroundColor: colors.border,
  },

  trainFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  runningDays: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  classes: {
    flexDirection: "row",
    gap: spacing.xs,
  },

  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },

  backText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
  },

  searchTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },

  stationInput: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },

  loader: {
    marginTop: spacing.xl,
  },

  stationList: {
    padding: spacing.lg,
  },

  stationResult: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  stationCode: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },

  stationName: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },

  stationCity: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});

export default SearchScreen;
