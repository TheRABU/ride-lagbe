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
exports.UserControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const SuccessResponse_1 = require("../../helpers/SuccessResponse");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const user_interface_1 = require("./user.interface");
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUserService(req.body);
    (0, SuccessResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "User created successfully",
        data: user,
    });
}));
// admin route
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const admin = yield user_model_1.User.findOne({ email: email });
        if (!admin) {
            throw new AppError_1.default(404, "User not found");
        }
        if (admin.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(403, "Unauthorized you are not an admin");
        }
        const users = yield user_model_1.User.find();
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "fetched all users",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
}));
const blockUnblockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield user_model_1.User.findOne({ email: email });
        if (!user) {
            throw new AppError_1.default(404, "User Not found!");
        }
        if (user.isActive === user_interface_1.IsActive.BLOCKED) {
            user.isActive = user_interface_1.IsActive.ACTIVE;
            yield user.save();
        }
        else {
            user.isActive = user_interface_1.IsActive.BLOCKED;
            yield user.save();
        }
        (0, SuccessResponse_1.sendResponse)(res, {
            success: true,
            message: `User is now ${user.isActive}`,
            statusCode: 201,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.UserControllers = {
    registerUser,
    getAllUsers,
    blockUnblockUser,
};
