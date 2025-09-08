import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/AppError";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
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
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
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
