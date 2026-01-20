export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  boardingPoint: string;
  boardingPointName: string;
  destination: string;
  destinationName: string;
  reservationUpTo: string;
  classType: string;
  chartPrepared: boolean;
  passengers: Passenger[];
}

export interface Passenger {
  number: number;
  bookingStatus: string;
  currentStatus: string;
  coachPosition?: number;
}

export interface ParsedBookingStatus {
  status: "CNF" | "RAC" | "WL" | "REGRET";
  coach?: string;
  seat?: string;
  waitlistNumber?: number;
}
