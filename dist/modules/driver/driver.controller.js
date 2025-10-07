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
exports.DriverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const SuccessResponse_1 = require("../../helpers/SuccessResponse");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const driver_interface_1 = require("./driver.interface");
const createProfile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
        const { driver_name, driver_nid, vehicle } = req.body;
        if (!userId)
            throw new Error("Unauthorized");
        const payload = {
            driver_email: email,
            driver_name,
            driver_nid,
            vehicle,
        };
        const driver = yield driver_service_1.DriverServices.createDriverProfile(payload);
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Driver profile created",
            data: driver,
        });
    }
    catch (error) {
        next(error);
    }
}));
// set availability (driver)
const setAvailability = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email)
        throw new Error("No email found for your please re-try");
    const driverPayload = {
        driver_email: email,
    };
    const driver = yield driver_service_1.DriverServices.setAvailability(driverPayload);
    (0, SuccessResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Driver is now online`,
        data: driver,
    });
}));
// accept ride (driver)
const acceptRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const { rideId } = req.params;
        if (!email) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Driver authentication required");
        }
        if (!rideId) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride ID is required");
        }
        const acceptRidePayload = {
            driver_email: email,
            rideId: new mongoose_1.Types.ObjectId(rideId),
        };
        const acceptedRide = yield driver_service_1.DriverServices.acceptRide(acceptRidePayload);
        // Find the ride and ensure it's in REQUESTED status
        // const ride = await Ride.findById(rideId);
        // if (!ride) {
        //   throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
        // }
        // if (ride.status !== RideStatus.REQUESTED) {
        //   throw new AppError(
        //     httpStatus.BAD_REQUEST,
        //     `Ride cannot be accepted. Current status: ${ride.status}`
        //   );
        // }
        // // Check if driver exists and is approved
        // const driver = await Driver.findOne({ driver_email: email });
        // if (!driver) {
        //   throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found");
        // }
        // //   if (driver.status !== DriverStatus.ONLINE) {
        // //     throw new AppError(
        // //       httpStatus.FORBIDDEN,
        // //       "Driver must be online to accept rides"
        // //     );
        // //   }
        // if (driver.currentRide) {
        //   throw new AppError(
        //     httpStatus.CONFLICT,
        //     "Driver is already on an active ride"
        //   );
        // }
        // // Update the ride with driver info and change status
        // const updatedRide = await Ride.findByIdAndUpdate(
        //   rideId,
        //   {
        //     driver_id: driverId,
        //     status: RideStatus.ACCEPTED,
        //     acceptedAt: new Date(),
        //   },
        //   { new: true } // Return the updated document
        // );
        // // Update driver's current ride
        // driver.currentRide = new Types.ObjectId(rideId);
        // driver.status = DriverStatus.ON_TRIP;
        // await driver.save();
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Ride accepted successfully",
            data: acceptedRide,
        });
    }
    catch (error) {
        next(error);
    }
}));
// reject ride
const rejectRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const { rideId } = req.params;
        if (!email)
            throw new Error("Email not found");
        if (!rideId)
            throw new Error("rideId required");
        const rejectionPayload = {
            driver_email: email,
            rideId,
        };
        const result = yield driver_service_1.DriverServices.rejectRide(rejectionPayload);
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Ride rejected",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
// update ride status completed!!
const completedRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const rideId = req.params.rideId;
        if (!email) {
            throw new AppError_1.default(403, "Email not found");
        }
        if (!rideId) {
            throw new AppError_1.default(403, "rideId not found");
        }
        const rideStatusPayload = {
            driver_email: email,
            rideId: new mongoose_1.Types.ObjectId(rideId),
        };
        const rideStatus = yield driver_service_1.DriverServices.completedRideService(rideStatusPayload);
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: "Ride completed",
            statusCode: 201,
            data: rideStatus,
        });
    }
    catch (error) {
        next(error);
    }
}));
// get earnings
const getEarnings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        throw new AppError_1.default(404, "Driver's email not found");
    }
    const myEarningPayload = {
        driver_email: email,
    };
    const result = yield driver_service_1.DriverServices.getEarnings(myEarningPayload);
    (0, SuccessResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Earnings fetched total earnings are: ${result} BDT`,
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield driver_model_1.Driver.find();
        if (drivers.length === 0) {
            res.status(200).json({
                message: "No drivers are in the database yet!",
            });
        }
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: "Found all the drivers",
            statusCode: 200,
            data: drivers,
        });
    }
    catch (error) {
        next(error);
    }
}));
const suspendUnsuspendDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email)
            throw new Error("Email is not found");
        const driver = yield driver_model_1.Driver.findOne({ driver_email: email });
        if (!driver) {
            throw new AppError_1.default(404, "No driver found");
        }
        if (driver.isService === driver_interface_1.DriverService.SUSPENDED) {
            driver.isService = driver_interface_1.DriverService.APPROVED;
            yield driver.save();
        }
        if (driver.isService === driver_interface_1.DriverService.APPROVED) {
            driver.isService = driver_interface_1.DriverService.SUSPENDED;
            yield driver.save();
        }
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: `Driver is now: ${driver.isService}`,
            statusCode: 201,
            data: driver,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.DriverController = {
    createProfile,
    setAvailability,
    acceptRide,
    rejectRide,
    completedRide,
    getEarnings,
    getAllDrivers,
    suspendUnsuspendDriver,
};
