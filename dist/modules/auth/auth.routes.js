"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/login", auth_controller_1.AuthController.credentialsLogin);
authRoutes.post("/logout", auth_controller_1.AuthController.logOut);
authRoutes.post("/refresh-token", auth_controller_1.AuthController.getNewAccessToken);
exports.default = authRoutes;
