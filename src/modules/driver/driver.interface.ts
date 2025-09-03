import { Types } from "mongoose";
import { IPoint, IsActive } from "../user/user.interface";

export interface IVehicle {
  model: string;
  licensePlate: string;
  color: string;
  year: number;
}

export enum DriverStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  ON_TRIP = "ON_TRIP",
}

export interface IDriver {
  _id?: Types.ObjectId;
  driver_email: string;
  driver_name: string;
  driver_phone: number;
  driver_nid: string;
  vehicle: IVehicle;
  ratings?: number;
  currentRide?: Types.ObjectId | null;
  earnings: number;
  currentLocation?: IPoint;
  status: DriverStatus;
  isApproved: boolean;
  isActive: IsActive;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
