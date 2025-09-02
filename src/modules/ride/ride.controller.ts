import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { Types } from "mongoose";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const { pickupLatitude, pickupLongitude, destLongitude, destLatitude } =
    req.body;

  //   const userId =
  //     typeof req.user === "string"
  //       ? req.user
  //       : req.user && typeof (req.user as any).userId === "string"
  //       ? (req.user as any).userId
  //       : undefined;
  const userId = (req.user as any)?.userId;
  if (!userId) {
    throw new Error("Invalid or missing userId in request.");
  }

  const ridePayload = {
    user_id: new Types.ObjectId(userId),
    pickup_location: {
      type: "Point" as const,
      coordinates: [pickupLongitude as number, pickupLatitude as number],
    },
    destination: {
      type: "Point" as const,
      coordinates: [destLongitude as number, destLatitude as number],
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
