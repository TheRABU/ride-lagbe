"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const user_interface_1 = require("../user/user.interface");
const vehicleSchema = new mongoose_1.Schema({
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
}, { _id: false });
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
}, { _id: false });
const driverSchema = new mongoose_1.Schema({
    driver_email: {
        type: String,
        required: true,
        unique: true,
    },
    driver_name: {
        type: String,
        required: true,
    },
    rideId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    // driver_phone: {
    //   type: Number,
    // },
    driver_nid: {
        type: String,
    },
    vehicle: {
        type: vehicleSchema,
        required: true,
    },
    currentRide: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Ride",
        default: null,
    },
    earnings: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    currentLocation: {
        type: pointSchema,
    },
    status: {
        type: String,
        enum: Object.values(driver_interface_1.DriverStatus),
        default: driver_interface_1.DriverStatus.OFFLINE,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isService: {
        type: String,
        enum: Object.values(driver_interface_1.DriverService),
        default: driver_interface_1.DriverService.APPROVED,
    },
}, { timestamps: true });
// Index for finding nearby drivers efficiently
driverSchema.index({ currentLocation: "2dsphere" });
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
