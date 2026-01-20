import { create } from "zustand";
import { Trip, CreateTripInput, TripWithLiveStatus } from "../types";
import { tripService } from "../services/tripService";

interface TripState {
  trips: Trip[];
  upcomingTrips: Trip[];
  pastTrips: Trip[];
  currentTrip: TripWithLiveStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTrips: (status?: "upcoming" | "completed" | "cancelled" | "all") => Promise<void>;
  fetchUpcomingTrips: () => Promise<void>;
  fetchPastTrips: () => Promise<void>;
  createTrip: (data: CreateTripInput) => Promise<Trip | null>;
  updateTrip: (tripId: string, data: Partial<CreateTripInput>) => Promise<boolean>;
  deleteTrip: (tripId: string) => Promise<boolean>;
  fetchLiveTracking: (tripId: string) => Promise<void>;
  clearCurrentTrip: () => void;
  clearError: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  upcomingTrips: [],
  pastTrips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async (status = "all") => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.getTrips(status);
      if (response.success) {
        set({ trips: response.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch trips", isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch trips",
        isLoading: false,
      });
    }
  },

  fetchUpcomingTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.getTrips("upcoming");
      if (response.success) {
        set({ upcomingTrips: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch upcoming trips",
        isLoading: false,
      });
    }
  },

  fetchPastTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.getTrips("completed");
      if (response.success) {
        set({ pastTrips: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch past trips",
        isLoading: false,
      });
    }
  },

  createTrip: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.createTrip(data);
      if (response.success) {
        const newTrip = response.data;
        set((state) => ({
          trips: [newTrip, ...state.trips],
          upcomingTrips: [newTrip, ...state.upcomingTrips],
          isLoading: false,
        }));
        return newTrip;
      }
      set({ error: "Failed to create trip", isLoading: false });
      return null;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create trip",
        isLoading: false,
      });
      return null;
    }
  },

  updateTrip: async (tripId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.updateTrip(tripId, data);
      if (response.success) {
        const updatedTrip = response.data;
        set((state) => ({
          trips: state.trips.map((t) => (t.id === tripId ? updatedTrip : t)),
          upcomingTrips: state.upcomingTrips.map((t) => (t.id === tripId ? updatedTrip : t)),
          isLoading: false,
        }));
        return true;
      }
      set({ error: "Failed to update trip", isLoading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update trip",
        isLoading: false,
      });
      return false;
    }
  },

  deleteTrip: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.deleteTrip(tripId);
      if (response.success) {
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== tripId),
          upcomingTrips: state.upcomingTrips.filter((t) => t.id !== tripId),
          pastTrips: state.pastTrips.filter((t) => t.id !== tripId),
          isLoading: false,
        }));
        return true;
      }
      set({ error: "Failed to delete trip", isLoading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete trip",
        isLoading: false,
      });
      return false;
    }
  },

  fetchLiveTracking: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripService.getLiveTracking(tripId);
      if (response.success) {
        set({
          currentTrip: {
            ...response.data.trip,
            liveStatus: response.data.liveStatus,
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch live tracking",
        isLoading: false,
      });
    }
  },

  clearCurrentTrip: () => set({ currentTrip: null }),

  clearError: () => set({ error: null }),
}));

export default useTripStore;
