import AppError from "../../helpers/AppError";
import { calculateDistanceKm } from "../../utils/distanceCalculator";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes";

// trip fare
const getRandomFare = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const requestRideService = async (payload: Partial<IRide>) => {
  // check the ride's status pending already or not
  const existingRide = await Ride.findOne({
    user_id: payload.user_id,
    status: "REQUESTED",
  });
  if (existingRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a ride request pending"
    );
  }
  // Calculate distance
  const [pickupLon, pickupLat] = payload.pickup_location!.coordinates;
  const [destLon, destLat] = payload.destination!.coordinates;

  const distanceKm = calculateDistanceKm(
    pickupLat,
    pickupLon,
    destLat,
    destLon
  );

  // Estimate duration (assuming avg 40km/h)
  const avgSpeedKmPerHour = 40;
  const durationHours = distanceKm / avgSpeedKmPerHour;
  const durationMinutes = Math.round(durationHours * 60);

  /* 
    if the trip's duration is more than 2 hours then the fare would be 500 and if less than 2hrs then 250 any random number.
  */
  // 2 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
  let tripFare = 0;

  if (durationMinutes > 120) {
    tripFare = getRandomFare(100, 500);
  } else {
    tripFare = getRandomFare(80, 250);
  }

  const ride = await Ride.create({
    ...payload,
    trip_fare: tripFare,
    duration: durationMinutes,
  });

  return ride;
};

const myRidesService = async (payload: Partial<IRide>) => {
  const email = payload.email;

  const rides = Ride.find({ email: email });

  return rides;
};

const cancelRideService = async (payload: Partial<IRide>) => {
  const { _id, email } = payload;

  const ride = await Ride.findOne({ _id, email });
  if (!ride) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride not found or invalid user"
    );
  }

  if (ride.status === RideStatus.ACCEPTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel an accepted ride"
    );
  }

  const deletedRide = await Ride.findByIdAndDelete(_id);

  return deletedRide;
};

export const RideServices = {
  requestRideService,
  myRidesService,
  cancelRideService,
};
