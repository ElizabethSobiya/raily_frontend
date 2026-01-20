import api from "./api";
import { Trip, CreateTripInput, UpdateTripInput, TripWithLiveStatus, ApiResponse, PaginatedResponse } from "../types";

export const tripService = {
  /**
   * Get user's trips
   */
  getTrips: async (
    status?: "upcoming" | "completed" | "cancelled" | "all",
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Trip>> => {
    const response = await api.get("/trips", {
      params: { status, page, limit },
    });
    return response.data;
  },

  /**
   * Create a new trip
   */
  createTrip: async (tripData: CreateTripInput): Promise<ApiResponse<Trip>> => {
    const response = await api.post("/trips", tripData);
    return response.data;
  },

  /**
   * Get trip by ID
   */
  getTripById: async (tripId: string): Promise<ApiResponse<Trip>> => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  /**
   * Update trip
   */
  updateTrip: async (tripId: string, updates: UpdateTripInput): Promise<ApiResponse<Trip>> => {
    const response = await api.put(`/trips/${tripId}`, updates);
    return response.data;
  },

  /**
   * Delete trip
   */
  deleteTrip: async (tripId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/trips/${tripId}`);
    return response.data;
  },

  /**
   * Get live tracking for a trip
   */
  getLiveTracking: async (tripId: string): Promise<ApiResponse<TripWithLiveStatus>> => {
    const response = await api.get(`/trips/${tripId}/live`);
    return response.data;
  },

  /**
   * Mark trip as completed
   */
  markComplete: async (tripId: string): Promise<ApiResponse<Trip>> => {
    const response = await api.post(`/trips/${tripId}/complete`);
    return response.data;
  },

  /**
   * Get trips by PNR
   */
  getTripsByPNR: async (pnr: string): Promise<ApiResponse<Trip[]>> => {
    const response = await api.get(`/trips/pnr/${pnr}`);
    return response.data;
  },
};

export default tripService;
