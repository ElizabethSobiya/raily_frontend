import api from "./api";
import { Station, StationSearchResult, ApiResponse, PaginatedResponse } from "../types";

export const stationService = {
  /**
   * List all stations (paginated)
   */
  getStations: async (page = 1, limit = 20): Promise<PaginatedResponse<Station>> => {
    const response = await api.get("/stations", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Search stations by name or code
   */
  search: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<StationSearchResult>> => {
    const response = await api.get("/stations/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  /**
   * Get popular stations
   */
  getPopular: async (): Promise<ApiResponse<StationSearchResult[]>> => {
    const response = await api.get("/stations/popular");
    return response.data;
  },

  /**
   * Get station details by code
   */
  getByCode: async (code: string): Promise<ApiResponse<Station>> => {
    const response = await api.get(`/stations/${code}`);
    return response.data;
  },

  /**
   * Get trains at a station
   */
  getTrainsAtStation: async (
    code: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<{
    trainNumber: string;
    trainName: string;
    arrivalTime: string | null;
    departureTime: string | null;
    platform: string | null;
  }>> => {
    const response = await api.get(`/stations/${code}/trains`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get arrivals at a station
   */
  getArrivals: async (code: string, limit = 10): Promise<ApiResponse<Array<{
    trainNumber: string;
    trainName: string;
    arrivalTime: string | null;
    platform: string | null;
    sourceStation: string;
  }>>> => {
    const response = await api.get(`/stations/${code}/arrivals`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get departures from a station
   */
  getDepartures: async (code: string, limit = 10): Promise<ApiResponse<Array<{
    trainNumber: string;
    trainName: string;
    departureTime: string | null;
    platform: string | null;
    destinationStation: string;
  }>>> => {
    const response = await api.get(`/stations/${code}/departures`, {
      params: { limit },
    });
    return response.data;
  },
};

export default stationService;
