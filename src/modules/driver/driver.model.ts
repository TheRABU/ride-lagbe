import { model, Schema } from "mongoose";
import { IDriver, IVehicle, DriverStatus } from "./driver.interface";
import { IPoint } from "../user/user.interface";

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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicle: {
      type: vehicleSchema,
      required: true,
    },
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
  },
  { timestamps: true }
);

// Index for finding nearby drivers efficiently
driverSchema.index({ currentLocation: "2dsphere" });

export const Driver = model<IDriver>("Driver", driverSchema);
