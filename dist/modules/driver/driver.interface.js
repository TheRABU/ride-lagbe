"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = exports.DriverStatus = void 0;
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["ONLINE"] = "ONLINE";
    DriverStatus["OFFLINE"] = "OFFLINE";
    DriverStatus["ON_TRIP"] = "ON_TRIP";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var DriverService;
(function (DriverService) {
    DriverService["SUSPENDED"] = "SUSPENDED";
    DriverService["APPROVED"] = "APPROVED";
})(DriverService || (exports.DriverService = DriverService = {}));
