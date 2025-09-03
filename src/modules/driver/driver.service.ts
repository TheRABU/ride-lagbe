// src/modules/driver/driver.service.ts
import AppError from "../../helpers/AppError";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { Driver } from "./driver.model";
import { Ride } from "../ride/ride.model";
import { DriverStatus, IDriver } from "./driver.interface";
import { RideStatus } from "../ride/ride.interface";
import { Role } from "../user/user.interface";

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
  return driver;
};

/**
 * Admin approval toggle
 */
const approveDriver = async (driverId: Types.ObjectId, approve = true) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  driver.isApproved = approve;
  await driver.save();
  return driver;
};

/**
 * Set driver availability (online/offline)
 */
const setAvailability = async (
  driverUserId: Types.ObjectId,
  isOnline: boolean
) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver) throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  if (!driver.isApproved)
    throw new AppError(httpStatus.FORBIDDEN, "Driver not approved");
  driver.status = DriverStatus.ONLINE;
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
const acceptRide = async (
  driverUserId: Types.ObjectId,
  rideId: Types.ObjectId
) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
  if (!driver.isApproved)
    throw new AppError(httpStatus.FORBIDDEN, "Driver not approved");
  if (!driver.isOnline)
    throw new AppError(httpStatus.FORBIDDEN, "Driver is offline");

  if (driver.currentRide) {
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
  ride.driver_id = driver._id; // or driver.user_id depending how you want to reference
  ride.status = RideStatus.ACCEPTED;
  await ride.save();

  driver.currentRide = ride._id;
  await driver.save();

  return ride;
};

/**
 * Reject ride (driver declines)
 * - optionally add reason or track rejection counts
 */
const rejectRide = async (
  driverUserId: Types.ObjectId,
  rideId: Types.ObjectId
) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  // only allow rejecting when requested
  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride cannot be rejected at this stage"
    );
  }

  // Optionally log rejection (not deleting)
  // For now, we just return a message so rider can get new driver
  return { message: "Ride rejected by driver" };
};

/**
 * Update ride status: driver updates in-transit/picked/completed
 */
const updateRideStatus = async (
  driverUserId: Types.ObjectId,
  rideId: Types.ObjectId,
  newStatus: RideStatus
) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

  // ensure driver assigned to this ride
  if (!ride.driver_id || ride.driver_id.toString() !== driver._id.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Driver not assigned to this ride"
    );
  }

  // Allowed transitions (simple guard)
  const allowed = {
    [RideStatus.ACCEPTED]: [
      RideStatus.IN_PROGRESS,
      RideStatus.CANCELLED_BY_DRIVER,
    ],
    [RideStatus.IN_PROGRESS]: [
      RideStatus.COMPLETED,
      RideStatus.CANCELLED_BY_DRIVER,
    ],
    [RideStatus.REQUESTED]: [
      RideStatus.ACCEPTED,
      RideStatus.CANCELLED_BY_DRIVER,
    ],
  };

  const current = ride.status;
  // If explicit allowed map exists, ensure newStatus is allowed; otherwise rely on business rules
  if (allowed[current] && !allowed[current].includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${current} to ${newStatus}`
    );
  }

  ride.status = newStatus;
  await ride.save();

  // On completion, clear driver's currentRide and add earnings
  if (newStatus === RideStatus.COMPLETED) {
    driver.currentRide = null;
    if (typeof ride.trip_fare === "number") {
      driver.earnings = (driver.earnings || 0) + ride.trip_fare;
    }
    await driver.save();
  }

  return ride;
};

/**
 * Driver earnings aggregation
 */
const getEarnings = async (driverUserId: Types.ObjectId) => {
  const driver = await Driver.findOne({ user_id: driverUserId });
  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");

  const result = await Ride.aggregate([
    { $match: { driver_id: driver._id, status: RideStatus.COMPLETED } },
    {
      $group: {
        _id: "$driver_id",
        totalEarnings: { $sum: "$trip_fare" },
        rides: { $push: "$$ROOT" },
      },
    },
  ]);

  return result[0] ?? { totalEarnings: 0, rides: [] };
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
  approveDriver,
  setAvailability,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getEarnings,
  getAssignedRides,
};
