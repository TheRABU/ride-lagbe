"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const pointSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});
const rideSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driver_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    pickup_location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number], // array of numbers which is latitude and longitude
            required: true,
        },
    },
    destination: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number], // array of numbers which is latitude and longitude
            required: true,
        },
    },
    trip_fare: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED,
    },
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
