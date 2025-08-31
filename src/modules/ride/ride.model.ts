import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>({
  location: {
    type: String,
    required: true,
  },
  trip_fare: {
    type: String,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(RideStatus),
    default: RideStatus.REQUESTED,
  },
});

export const Ride = model("Ride", rideSchema);
