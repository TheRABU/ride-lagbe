"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/create", user_controller_1.UserControllers.registerUser);
userRoutes.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers);
//admin
userRoutes.patch("/block-unblock/:email", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.blockUnblockUser);
exports.default = userRoutes;
