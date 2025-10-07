"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED_BY_USER"] = "CANCELLED_BY_USER";
    RideStatus["CANCELLED_BY_DRIVER"] = "CANCELLED_BY_DRIVER";
    RideStatus["NO_DRIVERS_FOUND"] = "NO_DRIVERS_FOUND";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
