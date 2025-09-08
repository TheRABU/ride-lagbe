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

export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // latitude, longitude
}

export interface IRide {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  driver_id?: Types.ObjectId | null;
  driver_name?: string;
  email: string;
  pickup_location: IGeoLocation;
  destination: IGeoLocation;
  trip_fare: number;
  duration: number;
  status: RideStatus;
}
