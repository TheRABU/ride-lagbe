"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
// src/modules/driver/driver.service.ts
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const ride_model_1 = require("../ride/ride.model");
const driver_interface_1 = require("./driver.interface");
const ride_interface_1 = require("../ride/ride.interface");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
/**
 * Create driver profile (called after user registers or separate flow)
 */
const createDriverProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield driver_model_1.Driver.findOne({ driver_email: payload.driver_email });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver profile already exists for this user");
    }
    const driver = yield driver_model_1.Driver.create(payload);
    // then change the user's role to driver
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: driver.driver_email }, { role: user_interface_1.Role.DRIVER }, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found with the provided email or could not update this user's role to driver");
    }
    return driver;
});
/**
 * Set driver availability (online/offline)
 */
const setAvailability = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ driver_email: payload.driver_email });
    if (!driver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    if (driver.currentRide !== null && driver.status === driver_interface_1.DriverStatus.ON_TRIP) {
        throw new AppError_1.default(404, "Driver is already on a trip! Complete that to set the available to online");
    }
    driver.status = driver_interface_1.DriverStatus.ONLINE;
    driver.currentRide = null;
    yield driver.save();
    return driver;
});
/**
 * Accept ride
 * - checks existence of ride
 * - checks ride.status == REQUESTED
 * - checks driver not busy / online & approved
 * - assigns driver and sets status ACCEPTED
 */
const acceptRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { driver_email, rideId } = payload;
    const driver = yield driver_model_1.Driver.findOne({ driver_email: driver_email });
    if (!driver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    if (driver.currentRide !== null && driver.status === driver_interface_1.DriverStatus.ON_TRIP) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Driver already on another active ride");
    }
    // find ride and ensure it is REQUESTED
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride is no longer available to accept");
    }
    // assign and update
    // ride.driver_id = driver._id;
    ride.status = ride_interface_1.RideStatus.ACCEPTED;
    yield ride.save();
    driver.currentRide = ride._id;
    driver.status = driver_interface_1.DriverStatus.ON_TRIP;
    yield driver.save();
    return ride;
});
/**
 * Reject ride (driver declines)
 * - optionally add reason or track rejection counts
 */
const rejectRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ driver_email: payload.driver_email });
    if (!driver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    const ride = yield ride_model_1.Ride.findById(payload.rideId);
    if (!ride)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    // only allow rejecting when requested
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride cannot be rejected at this stage");
    }
    ride.driver_id = null;
    yield ride.save();
    return {
        ride,
        message: `Ride rejected by driver: ${driver.driver_email}`,
    };
});
/**
 * Update ride status: driver updates in-transit/picked/completed
 */
const completedRideService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { driver_email, rideId } = payload;
    const driver = yield driver_model_1.Driver.findOne({ driver_email: driver_email });
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!driver) {
        throw new AppError_1.default(403, "No driver found");
    }
    if (!ride) {
        throw new AppError_1.default(403, "no Ride found");
    }
    ride.status = ride_interface_1.RideStatus.COMPLETED;
    yield ride.save();
    driver.earnings += ride.trip_fare;
    driver.currentRide = null;
    driver.status = driver_interface_1.DriverStatus.ONLINE;
    yield driver.save();
    const completedRideObj = {
        ride,
        driver,
    };
    return completedRideObj;
});
/**
 * Driver earnings aggregation
 */
const getEarnings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ driver_email: payload.driver_email });
    if (!driver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    // const result = await Ride.aggregate([
    //   {
    //     $match: {
    //       driver_email: driver.driver_email,
    //       status: RideStatus.COMPLETED,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$driver_id",
    //       totalEarnings: { $sum: "$trip_fare" },
    //       rides: { $push: "$$ROOT" },
    //     },
    //   },
    // ]);
    // return result[0] ?? { totalEarnings: 0, rides: [] };
    const myEarnings = driver.earnings;
    return myEarnings;
});
/**
 * Get assigned (active/past) rides for driver
 */
const getAssignedRides = (driverUserId_1, ...args_1) => __awaiter(void 0, [driverUserId_1, ...args_1], void 0, function* (driverUserId, filter = {}) {
    const driver = yield driver_model_1.Driver.findOne({ user_id: driverUserId });
    if (!driver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    const query = Object.assign({ driver_id: driver._id }, filter);
    const rides = yield ride_model_1.Ride.find(query).sort({ createdAt: -1 });
    return rides;
});
exports.DriverServices = {
    createDriverProfile,
    setAvailability,
    acceptRide,
    rejectRide,
    completedRideService,
    getEarnings,
    getAssignedRides,
};
