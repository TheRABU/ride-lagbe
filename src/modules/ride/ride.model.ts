import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const rideSchema = new Schema<IRide>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver_id: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pickup_location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // array of numbers which is latitude and longitude
      required: true,
    },
  },
  destination: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // array of numbers which is latitude and longitude
      required: true,
    },
  },
  trip_fare: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  status: {
    type: String,
    enum: Object.values(RideStatus),
    default: RideStatus.REQUESTED,
  },
});

export const Ride = model<IRide>("Ride", rideSchema);
