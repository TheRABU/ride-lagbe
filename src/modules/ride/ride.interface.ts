import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED_BY_USER = "CANCELLED_BY_USER",
  CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER",
  NO_DRIVERS_FOUND = "NO_DRIVERS_FOUND",
}

export interface IRide {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  location: string;
  trip_fare: string;
  duration: string;
  status: RideStatus;
}
