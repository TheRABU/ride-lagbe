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
exports.RideController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ride_service_1 = require("./ride.service");
const SuccessResponse_1 = require("../../helpers/SuccessResponse");
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = require("./ride.model");
/**
 * THE ride related apis here is for users... user's request for a ride and his own status, delete etc options.
 *
 * the driver's ride related apis are in the driver module
 *
 */
//api/v1/rides/request
const requestRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { pickupLatitude, pickupLongitude, destLongitude, destLatitude } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new Error("Invalid or missing userId in request.");
    }
    const pickupLat = parseFloat(pickupLatitude);
    const pickupLng = parseFloat(pickupLongitude);
    const destLat = parseFloat(destLatitude);
    const destLng = parseFloat(destLongitude);
    if (isNaN(pickupLat) ||
        isNaN(pickupLng) ||
        isNaN(destLat) ||
        isNaN(destLng)) {
        throw new Error("Invalid coordinates. Must be numbers.");
    }
    const ridePayload = {
        user_id: userId,
        email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
        pickup_location: {
            type: "Point",
            coordinates: [pickupLng, pickupLat],
        },
        destination: {
            type: "Point",
            coordinates: [destLng, destLat],
        },
    };
    const requestedRide = yield ride_service_1.RideServices.requestRideService(ridePayload);
    (0, SuccessResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Requested Ride successfully",
        data: requestedRide,
    });
}));
//api/v1/rides/me
const getMyRequestedRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new Error("Invalid or missing userId in request.");
        }
        const myInfoPayload = {
            user_id: userId,
            email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
        };
        const myInfo = yield ride_service_1.RideServices.myRidesService(myInfoPayload);
        if (!myInfo || myInfo.length === 0) {
            return (0, SuccessResponse_1.sendResponse)(res, {
                success: true,
                message: "No rides found yet for this user.",
                statusCode: 200,
                data: [],
            });
        }
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: `Fetched all requests of the user`,
            statusCode: 201,
            data: myInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
// api/v1/rides/:id/status
const cancelRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const payload = {
            _id: new mongoose_1.default.Types.ObjectId(id),
            email,
        };
        const deletedRide = yield ride_service_1.RideServices.cancelRideService(payload);
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: "Ride cancelled successfully",
            statusCode: 200,
            data: deletedRide,
        });
    }
    catch (error) {
        next(error);
    }
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield ride_model_1.Ride.find();
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: "Fetched all rides data",
            statusCode: 201,
            data: rides,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.RideController = {
    requestRide,
    getMyRequestedRides,
    cancelRide,
    getAllRides,
};
