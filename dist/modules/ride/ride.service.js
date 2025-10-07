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
exports.RideServices = void 0;
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const distanceCalculator_1 = require("../../utils/distanceCalculator");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// trip fare
const getRandomFare = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const requestRideService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check the ride's status pending already or not
    const existingRide = yield ride_model_1.Ride.findOne({
        user_id: payload.user_id,
        status: "REQUESTED",
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have a ride request pending");
    }
    // Calculate distance
    const [pickupLon, pickupLat] = payload.pickup_location.coordinates;
    const [destLon, destLat] = payload.destination.coordinates;
    const distanceKm = (0, distanceCalculator_1.calculateDistanceKm)(pickupLat, pickupLon, destLat, destLon);
    // Estimate duration (assuming avg 40km/h)
    const avgSpeedKmPerHour = 40;
    const durationHours = distanceKm / avgSpeedKmPerHour;
    const durationMinutes = Math.round(durationHours * 60);
    /*
      if the trip's duration is more than 2 hours then the fare would be 500 and if less than 2hrs then 250 any random number.
    */
    // 2 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
    let tripFare = 0;
    if (durationMinutes > 120) {
        tripFare = getRandomFare(100, 500);
    }
    else {
        tripFare = getRandomFare(80, 250);
    }
    const ride = yield ride_model_1.Ride.create(Object.assign(Object.assign({}, payload), { trip_fare: tripFare, duration: durationMinutes }));
    return ride;
});
const myRidesService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload.email;
    const rides = ride_model_1.Ride.find({ email: email });
    return rides;
});
const cancelRideService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = payload;
    const ride = yield ride_model_1.Ride.findOne({ _id, email });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride not found or invalid user");
    }
    if (ride.status === ride_interface_1.RideStatus.ACCEPTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cancel an accepted ride");
    }
    const deletedRide = yield ride_model_1.Ride.findByIdAndDelete(_id);
    return deletedRide;
});
exports.RideServices = {
    requestRideService,
    myRidesService,
    cancelRideService,
};
