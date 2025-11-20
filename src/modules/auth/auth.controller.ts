import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/AppError";
import { User } from "../user/user.model";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isProduction = process.env.NODE_ENV === "production";

    const loginInfo = await AuthServices.credentialsLogin(req.body);

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      path: "/",
    });

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      path: "/",
    });

    sendResponse(res, {
      success: true,
      message: "Logged in successfully",
      statusCode: 201,
      data: loginInfo,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isProduction = process.env.NODE_ENV === "production";
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
      });

      res.status(201).json({
        success: true,
        message: "Logged out successfully!",
        body: null,
      });
    } catch (error: any) {
      console.log("error at auth.controller.ts LOGOUT::", error.message);
      next();
    }
  }
);

const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token found from cookies!"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    // setAuthCookie(res, tokenInfo);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(201).json({
      success: true,
      message: "Got Token successfully!",
      body: tokenInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  credentialsLogin,
  logOut,
  getNewAccessToken,
};
