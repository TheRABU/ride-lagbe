import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { Types } from "mongoose";
import { IRide } from "./ride.interface";

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

export const RideController = {
  requestRide,
};
