import { LiveTrainStatus } from "./train.types";

export interface Trip {
  id: string;
  userId: string;
  trainNumber: string;
  trainName: string | null;
  pnr: string | null;
  journeyDate: string;
  sourceStation: string;
  destinationStation: string;
  departureTime: string | null;
  arrivalTime: string | null;
  status: TripStatus;
  isLive: boolean;
  coach: string | null;
  seatBerth: string | null;
  delayAlertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TripStatus = "upcoming" | "live" | "completed" | "cancelled";

export interface CreateTripInput {
  trainNumber: string;
  trainName?: string;
  pnr?: string;
  journeyDate: string;
  sourceStation: string;
  destinationStation: string;
  departureTime?: string;
  arrivalTime?: string;
  coach?: string;
  seatBerth?: string;
}

export interface UpdateTripInput extends Partial<CreateTripInput> {}

export interface TripWithLiveStatus extends Trip {
  liveStatus: LiveTrainStatus | null;
}
