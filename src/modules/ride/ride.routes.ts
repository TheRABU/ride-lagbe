import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const rideRoutes = Router();

rideRoutes.post("/request", checkAuth(Role.USER), RideController.requestRide);
rideRoutes.get("/me", checkAuth(Role.USER), RideController.getMyRequestedRides);
rideRoutes.delete("/:id", checkAuth(Role.USER), RideController.cancelRide);

rideRoutes.get(
  "/active-rides",
  checkAuth(Role.DRIVER, Role.ADMIN),
  RideController.getActiveRides
);

export default rideRoutes;
