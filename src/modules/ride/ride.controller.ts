import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { IRide, RideStatus } from "./ride.interface";
import mongoose from "mongoose";
import { Ride } from "./ride.model";

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
        sendResponse(res, {
          success: true,
          message: "No active request found",
          statusCode: 201,
          data: [],
        });
      } else {
        sendResponse(res, {
          success: true,
          message: `Fetched all requests of the user: ${myInfo[0].email}`,
          statusCode: 201,
          data: myInfo,
        });
      }
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

/*

  getAll available rides

*/

const getActiveRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rides = await Ride.aggregate([
        {
          $match: {
            status: RideStatus.REQUESTED,
          },
        },
      ]);
      res.status(200).json({
        status: "success",
        results: rides.length,
        data: rides,
      });
    } catch (error: any) {
      console.error("Error at getting active rides", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch active rides",
      });
    }
  }
);

export const RideController = {
  requestRide,
  getMyRequestedRides,
  cancelRide,
  getActiveRides,
};
