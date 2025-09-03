// src/modules/driver/driver.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { Types } from "mongoose";

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

// admin approve
const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const approved =
    req.body.approved === undefined ? true : Boolean(req.body.approved);
  const driver = await DriverServices.approveDriver(
    new Types.ObjectId(driverId),
    approved
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Driver ${approved ? "approved" : "suspended"}`,
    data: driver,
  });
});

// set availability (driver)
const setAvailability = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new Error("Unauthorized");

  const isOnline = Boolean(req.body.isOnline);
  const driver = await DriverServices.setAvailability(
    new Types.ObjectId(userId),
    isOnline
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Driver is now ${isOnline ? "online" : "offline"}`,
    data: driver,
  });
});

// accept ride (driver)
const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // driver's id
  const { rideId } = req.body;
  if (!userId) throw new Error("Unauthorized");
  if (!rideId) throw new Error("rideId required");

  const ridePayload = {};
  const ride = await DriverServices.acceptRide(
    new Types.ObjectId(userId),
    new Types.ObjectId(rideId)
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride accepted",
    data: ride,
  });
});

// reject ride
const rejectRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { rideId } = req.body;
      if (!userId) throw new Error("Unauthorized");
      if (!rideId) throw new Error("rideId required");
      const result = await DriverServices.rejectRide(
        new Types.ObjectId(userId),
        new Types.ObjectId(rideId)
      );
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

// update ride status
const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { rideId, status } = req.body;
  if (!userId) throw new Error("Unauthorized");
  if (!rideId || !status) throw new Error("rideId and status required");

  // validate status belongs to RideStatus enum externally or parse
  const ride = await DriverServices.updateRideStatus(
    new Types.ObjectId(userId),
    new Types.ObjectId(rideId),
    status
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride status updated",
    data: ride,
  });
});

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

// get assigned rides
const getAssignedRides = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new Error("Unauthorized");
  const rides = await DriverServices.getAssignedRides(
    new Types.ObjectId(userId)
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Assigned rides",
    data: rides,
  });
});

export const DriverController = {
  createProfile,
  approveDriver,
  setAvailability,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getEarnings,
  getAssignedRides,
};
