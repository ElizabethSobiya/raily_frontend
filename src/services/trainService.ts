import api from "./api";
import { Train, TrainSchedule, LiveTrainStatus, TrainSearchResult, ApiResponse, PaginatedResponse } from "../types";

export const trainService = {
  /**
   * Search trains by name or number
   */
  search: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<TrainSearchResult>> => {
    const response = await api.get("/trains/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  /**
   * Get train details by number
   */
  getDetails: async (trainNumber: string): Promise<ApiResponse<Train>> => {
    const response = await api.get(`/trains/${trainNumber}`);
    return response.data;
  },

  /**
   * Get complete train schedule with route
   */
  getSchedule: async (trainNumber: string): Promise<ApiResponse<TrainSchedule>> => {
    const response = await api.get(`/trains/${trainNumber}/schedule`);
    return response.data;
  },

  /**
   * Get live running status of a train
   */
  getLiveStatus: async (trainNumber: string, date: string): Promise<ApiResponse<LiveTrainStatus>> => {
    const response = await api.get(`/trains/${trainNumber}/live`, {
      params: { date },
    });
    return response.data;
  },

  /**
   * Get running status summary
   */
  getRunningStatus: async (trainNumber: string, date?: string): Promise<ApiResponse<{
    trainNumber: string;
    trainName: string;
    status: string;
    delayMinutes: number;
    currentStation: string;
    currentStationName: string;
    lastUpdated: string;
  }>> => {
    const response = await api.get(`/trains/${trainNumber}/status`, {
      params: date ? { date } : undefined,
    });
    return response.data;
  },

  /**
   * Find trains between two stations
   */
  getTrainsBetween: async (
    from: string,
    to: string,
    date: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<TrainSearchResult>> => {
    const response = await api.get("/trains/between/stations", {
      params: { from, to, date, page, limit },
    });
    return response.data;
  },
};

export default trainService;
