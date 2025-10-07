"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const ride_routes_1 = __importDefault(require("../modules/ride/ride.routes"));
const driver_routes_1 = __importDefault(require("../modules/driver/driver.routes"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.default,
    },
    {
        path: "/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/rides",
        route: ride_routes_1.default,
    },
    {
        path: "/drivers",
        route: driver_routes_1.default,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
