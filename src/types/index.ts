export * from "./train.types";
export * from "./pnr.types";
export * from "./trip.types";
export * from "./station.types";
export * from "./user.types";

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total?: number;
    hasMore: boolean;
  };
}

export interface Notification {
  id: string;
  userId: string;
  tripId: string | null;
  type: NotificationType;
  title: string;
  message: string | null;
  isRead: boolean;
  sentAt: string;
  metadata: Record<string, unknown> | null;
}

export type NotificationType =
  | "delay_alert"
  | "platform_change"
  | "arrival_reminder"
  | "departure_reminder"
  | "pnr_update"
  | "train_cancelled";
