import { model, Schema } from "mongoose";
import {
  IDriver,
  IVehicle,
  DriverStatus,
  DriverService,
} from "./driver.interface";
import { IPoint, IsActive } from "../user/user.interface";

const vehicleSchema = new Schema<IVehicle>(
  {
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { _id: false }
);

const pointSchema = new Schema<IPoint>(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const driverSchema = new Schema<IDriver>(
  {
    driver_email: {
      type: String,
      required: true,
      unique: true,
    },
    driver_name: {
      type: String,
      required: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
    },
    // driver_phone: {
    //   type: Number,
    // },
    driver_nid: {
      type: String,
    },
    vehicle: {
      type: vehicleSchema,
      required: true,
    },
    currentRide: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    earnings: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    currentLocation: {
      type: pointSchema,
    },
    status: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.OFFLINE,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isService: {
      type: String,
      enum: Object.values(DriverService),
      default: DriverService.APPROVED,
    },
  },
  { timestamps: true }
);

// Index for finding nearby drivers efficiently
driverSchema.index({ currentLocation: "2dsphere" });

export const Driver = model<IDriver>("Driver", driverSchema);
