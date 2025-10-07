"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/driver/driver.routes.ts
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("./driver.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const driver_validation_1 = require("./driver.validation");
const driverRoutes = express_1.default.Router();
driverRoutes.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(driver_validation_1.createDriverProfileValidation), driver_controller_1.DriverController.createProfile);
// driverRoutes.patch(
//   "/approve/:id",
//   checkAuth(Role.ADMIN),
//   DriverController.approveDriver
// ); // admin
driverRoutes.patch("/availability", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.setAvailability);
// accept ride
driverRoutes.patch("/accept/:rideId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.acceptRide);
driverRoutes.post("/reject", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.rejectRide);
// completed ride
driverRoutes.patch("/status/:rideId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.completedRide);
driverRoutes.get("/earnings", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getEarnings);
// driverRoutes.get(
//   "/rides",
//   checkAuth(Role.DRIVER),
//   DriverController.getAssignedRides
// );
driverRoutes.get("/all-drivers", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), driver_controller_1.DriverController.getAllDrivers);
//admin
driverRoutes.patch("/suspend-unsuspend/:email", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), driver_controller_1.DriverController.suspendUnsuspendDriver);
exports.default = driverRoutes;
