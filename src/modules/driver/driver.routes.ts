// src/modules/driver/driver.routes.ts
import express from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const driverRoutes = express.Router();

driverRoutes.post("/", checkAuth(Role.USER), DriverController.createProfile);
driverRoutes.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN),
  DriverController.approveDriver
); // admin
driverRoutes.patch(
  "/availability",
  checkAuth(Role.DRIVER),
  DriverController.setAvailability
);
driverRoutes.patch(
  "/accept/:rideId",
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);
driverRoutes.post(
  "/reject",
  checkAuth(Role.DRIVER),
  DriverController.rejectRide
);
driverRoutes.patch(
  "/status",
  checkAuth(Role.DRIVER),
  DriverController.updateRideStatus
);
driverRoutes.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  DriverController.getEarnings
);
driverRoutes.get(
  "/rides",
  checkAuth(Role.DRIVER),
  DriverController.getAssignedRides
);

export default driverRoutes;
