// src/modules/driver/driver.service.ts
import AppError from "../../helpers/AppError";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { Driver } from "./driver.model";
import { Ride } from "../ride/ride.model";
import { DriverStatus, IDriver } from "./driver.interface";
import { IRide, RideStatus } from "../ride/ride.interface";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

/**
 * Create driver profile (called after user registers or separate flow)
 */
const createDriverProfile = async (payload: Partial<IDriver>) => {
  const existing = await Driver.findOne({ driver_email: payload.driver_email });
  if (existing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Driver profile already exists for this user"
    );
  }
  const driver = await Driver.create(payload);
  // then change the user's role to driver

  const updatedUser = await User.findOneAndUpdate(
    { email: driver.driver_email },
    { role: Role.DRIVER },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found with the provided email or could not update this user's role to driver"
    );
  }

  return driver;
};

/**
 * Set driver availability (online/offline)
 */
const setAvailability = async (payload: Partial<IDriver>) => {
  const driver = await Driver.findOne({ driver_email: payload.driver_email });
  if (!driver) throw new AppError(httpStatus.NOT_FOUND, "Driver not found");

  if (driver.currentRide !== null && driver.status === DriverStatus.ON_TRIP) {
    throw new AppError(
      404,
      "Driver is already on a trip! Complete that to set the available to online"
    );
  }

  driver.status = DriverStatus.ONLINE;
  driver.currentRide = null;
  await driver.save();
  return driver;
};

/**
 * Accept ride
 * - checks existence of ride
 * - checks ride.status == REQUESTED
 * - checks driver not busy / online & approved
 * - assigns driver and sets status ACCEPTED
 */
const acceptRide = async (payload: Partial<IDriver>) => {
  const { driver_email, rideId } = payload;
  const driver = await Driver.findOne({ driver_email: driver_email });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  if (driver.currentRide !== null && driver.status === DriverStatus.ON_TRIP) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Driver already on another active ride"
    );
  }

  // find ride and ensure it is REQUESTED
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride is no longer available to accept"
    );
  }

  // assign and update
  // ride.driver_id = driver._id;
  ride.status = RideStatus.ACCEPTED;
  await ride.save();

  driver.currentRide = ride._id;
  driver.status = DriverStatus.ON_TRIP;
  await driver.save();

  return ride;
};

/**
 * Reject ride (driver declines)
 * - optionally add reason or track rejection counts
 */
const rejectRide = async (payload: Partial<IDriver>) => {
  const driver = await Driver.findOne({ driver_email: payload.driver_email });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  const ride = await Ride.findById(payload.rideId);

  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  // only allow rejecting when requested
  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride cannot be rejected at this stage"
    );
  }

  ride.driver_id = null;
  await ride.save();
  return {
    ride,
    message: `Ride rejected by driver: ${driver.driver_email}`,
  };
};

/**
 * Update ride status: driver updates in-transit/picked/completed
 */
const completedRideService = async (payload: Partial<IDriver>) => {
  const { driver_email, rideId } = payload;

  const driver = await Driver.findOne({ driver_email: driver_email });
  const ride = await Ride.findById(rideId);

  if (!driver) {
    throw new AppError(403, "No driver found");
  }
  if (!ride) {
    throw new AppError(403, "no Ride found");
  }

  ride.status = RideStatus.COMPLETED;
  await ride.save();
  driver.earnings += ride.trip_fare;
  driver.currentRide = null;
  driver.status = DriverStatus.ONLINE;
  await driver.save();

  const completedRideObj = {
    ride,
    driver,
  };
  return completedRideObj;
};

/**
 * Driver earnings aggregation
 */
const getEarnings = async (payload: Partial<IDriver>) => {
  const driver = await Driver.findOne({ driver_email: payload.driver_email });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  // const result = await Ride.aggregate([
  //   {
  //     $match: {
  //       driver_email: driver.driver_email,
  //       status: RideStatus.COMPLETED,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$driver_id",
  //       totalEarnings: { $sum: "$trip_fare" },
  //       rides: { $push: "$$ROOT" },
  //     },
  //   },
  // ]);

  // return result[0] ?? { totalEarnings: 0, rides: [] };

  const myEarnings = driver.earnings;

  return myEarnings;
};

/**
 * Get assigned (active/past) rides for driver
 */
const getAssignedRides = async (
  driverUserId: Types.ObjectId,
  filter: any = {}
) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  const query: any = { driver_id: driver._id, ...filter };
  const rides = await Ride.find(query).sort({ createdAt: -1 });
  return rides;
};

export const DriverServices = {
  createDriverProfile,

  setAvailability,
  acceptRide,
  rejectRide,
  completedRideService,
  getEarnings,
  getAssignedRides,
};
