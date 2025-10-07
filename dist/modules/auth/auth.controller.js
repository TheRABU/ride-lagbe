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
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const SuccessResponse_1 = require("../../helpers/SuccessResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthServices.credentialsLogin(req.body);
    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false,
    });
    (0, SuccessResponse_1.sendResponse)(res, {
        success: true,
        message: "Logged in successfully",
        statusCode: 201,
        data: loginInfo,
    });
}));
const logOut = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            // sameSite: "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            // sameSite: "lax",
        });
        res.status(201).json({
            success: true,
            message: "Logged out successfully!",
            body: null,
        });
    }
    catch (error) {
        console.log("error at auth.controller.ts LOGOUT::", error.message);
        next();
    }
}));
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token found from cookies!");
        }
        const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
        // setAuthCookie(res, tokenInfo);
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
        });
        res.status(201).json({
            success: true,
            message: "Got Token successfully!",
            body: tokenInfo,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    credentialsLogin,
    logOut,
    getNewAccessToken,
};
