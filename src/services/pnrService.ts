import api from "./api";
import { PNRStatus, Passenger, ApiResponse } from "../types";

export const pnrService = {
  /**
   * Get PNR status
   */
  getStatus: async (pnr: string): Promise<ApiResponse<PNRStatus> & { cached?: boolean }> => {
    const response = await api.get(`/pnr/${pnr}`);
    return response.data;
  },

  /**
   * Batch check multiple PNRs
   */
  checkMultiple: async (pnrs: string[]): Promise<ApiResponse<Array<{
    pnr: string;
    success: boolean;
    data?: PNRStatus;
    error?: string;
  }>>> => {
    const response = await api.post("/pnr/check", { pnrs });
    return response.data;
  },

  /**
   * Get passenger details from PNR
   */
  getPassengers: async (pnr: string): Promise<ApiResponse<Passenger[]>> => {
    const response = await api.get(`/pnr/${pnr}/passengers`);
    return response.data;
  },

  /**
   * Force refresh PNR status (bypasses cache)
   */
  refreshStatus: async (pnr: string): Promise<ApiResponse<PNRStatus>> => {
    const response = await api.post(`/pnr/${pnr}/refresh`);
    return response.data;
  },
};

/**
 * Parse booking status string (e.g., "CNF/B2/45") into structured data
 */
export function parseBookingStatus(status: string): {
  status: "CNF" | "RAC" | "WL" | "REGRET" | "UNKNOWN";
  coach?: string;
  seat?: string;
  waitlistNumber?: number;
} {
  if (!status) return { status: "UNKNOWN" };

  const upperStatus = status.toUpperCase();

  if (upperStatus.startsWith("CNF")) {
    const parts = status.split("/");
    return {
      status: "CNF",
      coach: parts[1],
      seat: parts[2],
    };
  }

  if (upperStatus.startsWith("RAC")) {
    const parts = status.split("/");
    return {
      status: "RAC",
      coach: parts[1],
      seat: parts[2],
    };
  }

  if (upperStatus.includes("WL") || upperStatus.includes("WAITING")) {
    const match = status.match(/(\d+)/);
    return {
      status: "WL",
      waitlistNumber: match ? parseInt(match[1]) : undefined,
    };
  }

  if (upperStatus.includes("REGRET") || upperStatus.includes("CANCEL")) {
    return { status: "REGRET" };
  }

  return { status: "UNKNOWN" };
}

export default pnrService;
