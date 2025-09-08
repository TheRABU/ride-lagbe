import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { IRide } from "./ride.interface";
import mongoose from "mongoose";
import { Ride } from "./ride.model";

/**
 * THE ride related apis here is for users... user's request for a ride and his own status, delete etc options.
 *
 * the driver's ride related apis are in the driver module
 *
 */

//api/v1/rides/request
const requestRide = catchAsync(async (req: Request, res: Response) => {
  const { pickupLatitude, pickupLongitude, destLongitude, destLatitude } =
    req.body;

  const userId = req.user?.userId;
  if (!userId) {
    throw new Error("Invalid or missing userId in request.");
  }

  const pickupLat = parseFloat(pickupLatitude);
  const pickupLng = parseFloat(pickupLongitude);
  const destLat = parseFloat(destLatitude);
  const destLng = parseFloat(destLongitude);

  if (
    isNaN(pickupLat) ||
    isNaN(pickupLng) ||
    isNaN(destLat) ||
    isNaN(destLng)
  ) {
    throw new Error("Invalid coordinates. Must be numbers.");
  }

  const ridePayload: Partial<IRide> = {
    user_id: userId,
    email: req.user?.email,
    pickup_location: {
      type: "Point",
      coordinates: [pickupLng, pickupLat],
    },
    destination: {
      type: "Point",
      coordinates: [destLng, destLat],
    },
  };

  const requestedRide = await RideServices.requestRideService(ridePayload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Requested Ride successfully",
    data: requestedRide,
  });
});

//api/v1/rides/me
const getMyRequestedRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error("Invalid or missing userId in request.");
      }
      const myInfoPayload = {
        user_id: userId,
        email: req.user?.email,
      };
      const myInfo = await RideServices.myRidesService(myInfoPayload);
      if (!myInfo || myInfo.length === 0) {
        return sendResponse(res, {
          success: true,
          message: "No rides found yet for this user.",
          statusCode: 200,
          data: [],
        });
      }
      sendResponse(res, {
        success: true,
        message: `Fetched all requests of the user`,
        statusCode: 201,
        data: myInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// api/v1/rides/:id/status
const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const email = req.user?.email;

      const payload = {
        _id: new mongoose.Types.ObjectId(id),
        email,
      };

      const deletedRide = await RideServices.cancelRideService(payload);

      sendResponse(res, {
        success: true,
        message: "Ride cancelled successfully",
        statusCode: 200,
        data: deletedRide,
      });
    } catch (error) {
      next(error);
    }
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rides = await Ride.find();
      sendResponse(res, {
        success: true,
        message: "Fetched all rides data",
        statusCode: 201,
        data: rides,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const RideController = {
  requestRide,
  getMyRequestedRides,
  cancelRide,
  getAllRides,
};
