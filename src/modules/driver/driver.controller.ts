// src/modules/driver/driver.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { Types } from "mongoose";
import { Ride } from "../ride/ride.model";
import AppError from "../../helpers/AppError";
import { RideStatus } from "../ride/ride.interface";
import httpStatus from "http-status-codes";
import { Driver } from "./driver.model";
import { DriverStatus } from "./driver.interface";
import { RideServices } from "../ride/ride.service";

const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      const email = req.user?.email;

      const { driver_name, driver_nid, vehicle } = req.body;

      if (!userId) throw new Error("Unauthorized");

      const payload = {
        driver_email: email,
        driver_name,
        driver_nid,
        vehicle,
      };

      const driver = await DriverServices.createDriverProfile(payload);
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Driver profile created",
        data: driver,
      });
    } catch (error) {
      next(error);
    }
  }
);

// set availability (driver)
const setAvailability = catchAsync(async (req: Request, res: Response) => {
  const email = req.user?.email;
  if (!email) throw new Error("No email found for your please re-try");

  const driverPayload = {
    driver_email: email,
  };

  const driver = await DriverServices.setAvailability(driverPayload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Driver is now online`,
    data: driver,
  });
});

// accept ride (driver)
const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user?.email;

      const { rideId } = req.params;
      if (!email) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Driver authentication required"
        );
      }

      if (!rideId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride ID is required");
      }

      const acceptRidePayload = {
        driver_email: email,
        rideId: new Types.ObjectId(rideId),
      };
      const acceptedRide = await DriverServices.acceptRide(acceptRidePayload);

      // Find the ride and ensure it's in REQUESTED status
      // const ride = await Ride.findById(rideId);

      // if (!ride) {
      //   throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
      // }

      // if (ride.status !== RideStatus.REQUESTED) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     `Ride cannot be accepted. Current status: ${ride.status}`
      //   );
      // }

      // // Check if driver exists and is approved
      // const driver = await Driver.findOne({ driver_email: email });

      // if (!driver) {
      //   throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
      // }

      // //   if (driver.status !== DriverStatus.ONLINE) {
      // //     throw new AppError(
      // //       httpStatus.FORBIDDEN,
      // //       "Driver must be online to accept rides"
      // //     );
      // //   }

      // if (driver.currentRide) {
      //   throw new AppError(
      //     httpStatus.CONFLICT,
      //     "Driver is already on an active ride"
      //   );
      // }

      // // Update the ride with driver info and change status
      // const updatedRide = await Ride.findByIdAndUpdate(
      //   rideId,
      //   {
      //     driver_id: driverId,
      //     status: RideStatus.ACCEPTED,
      //     acceptedAt: new Date(),
      //   },
      //   { new: true } // Return the updated document
      // );

      // // Update driver's current ride
      // driver.currentRide = new Types.ObjectId(rideId);
      // driver.status = DriverStatus.ON_TRIP;
      // await driver.save();

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride accepted successfully",
        data: acceptedRide,
      });
    } catch (error) {
      next(error);
    }
  }
);

// reject ride
const rejectRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user?.email;
      const { rideId } = req.params;
      if (!email) throw new Error("Email not found");
      if (!rideId) throw new Error("rideId required");

      const rejectionPayload = {
        driver_email: email,
        rideId,
      };

      const result = await DriverServices.rejectRide(rejectionPayload);

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride rejected",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// update ride status completed!!
const completedRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user?.email;
      const rideId = req.params.rideId;

      if (!email) {
        throw new AppError(403, "Email not found");
      }
      if (!rideId) {
        throw new AppError(403, "rideId not found");
      }
      const rideStatusPayload = {
        driver_email: email,
        rideId: new Types.ObjectId(rideId),
      };
      const rideStatus = await DriverServices.completedRideService(
        rideStatusPayload
      );
      sendResponse(res, {
        success: true,
        message: "Ride completed",
        statusCode: 201,
        data: rideStatus,
      });
    } catch (error) {
      next(error);
    }
  }
);
// get earnings
const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new Error("Unauthorized");
  const result = await DriverServices.getEarnings(new Types.ObjectId(userId));
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Earnings fetched",
    data: result,
  });
});

const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drivers = await Driver.find();

      if (drivers.length === 0) {
        res.status(200).json({
          message: "No drivers are in the database yet!",
        });
      }

      sendResponse(res, {
        success: true,
        message: "Found all the drivers",
        statusCode: 200,
        data: drivers,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const DriverController = {
  createProfile,
  setAvailability,
  acceptRide,
  rejectRide,
  completedRide,
  getEarnings,
  getAllDrivers,
};
