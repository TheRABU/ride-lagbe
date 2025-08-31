import { Types } from "mongoose";
import { IPoint } from "../user/user.interface";

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
  user: Types.ObjectId;
  vehicle: IVehicle;
  currentLocation?: IPoint;
  status: DriverStatus;
  rating: number;
  totalRides: number;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
