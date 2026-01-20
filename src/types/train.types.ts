export interface Train {
  trainNumber: string;
  trainName: string;
  trainType: string;
  sourceStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  distance?: number;
  runningDays: number[];
  coaches?: string[];
}

export interface TrainSchedule extends Train {
  route: TrainStop[];
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string | null;
  departureTime: string | null;
  haltMinutes: number;
  stopNumber: number;
  platform?: string;
  distanceKm: number;
  dayOffset: number;
}

export interface LiveTrainStatus {
  trainNumber: string;
  trainName: string;
  currentStation: string;
  currentStationName: string;
  lastStation: string;
  lastStationName: string;
  nextStation: string;
  nextStationName: string;
  delayMinutes: number;
  etaNextStation: string;
  lastUpdated: string;
  position?: {
    lat: number;
    lng: number;
  };
  status: "running" | "arrived" | "departed" | "not_started" | "terminated";
}

export interface TrainSearchResult {
  trainNumber: string;
  trainName: string;
  trainType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  sourceStation: string;
  destinationStation: string;
  runningDays: number[];
  classes: string[];
}

export interface SeatAvailability {
  classType: string;
  status: "AVAILABLE" | "RAC" | "WL" | "REGRET";
  availableSeats?: number;
  waitlistNumber?: number;
}
