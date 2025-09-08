// src/modules/driver/driver.routes.ts
import express from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDriverProfileValidation } from "./driver.validation";

const driverRoutes = express.Router();

driverRoutes.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(createDriverProfileValidation),
  DriverController.createProfile
);
// driverRoutes.patch(
//   "/approve/:id",
//   checkAuth(Role.ADMIN),
//   DriverController.approveDriver
// ); // admin
driverRoutes.patch(
  "/availability",
  checkAuth(Role.DRIVER),
  DriverController.setAvailability
);
// accept ride
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

// completed ride
driverRoutes.patch(
  "/status/:rideId",
  checkAuth(Role.DRIVER),
  DriverController.completedRide
);
driverRoutes.get(
  "/earnings",
  checkAuth(Role.DRIVER),
  DriverController.getEarnings
);
// driverRoutes.get(
//   "/rides",
//   checkAuth(Role.DRIVER),
//   DriverController.getAssignedRides
// );

driverRoutes.get(
  "/all-drivers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverController.getAllDrivers
);

//admin
driverRoutes.patch(
  "/suspend-unsuspend/:email",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverController.suspendUnsuspendDriver
);

export default driverRoutes;
