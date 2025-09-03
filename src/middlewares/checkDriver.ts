import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Driver } from "../modules/driver/driver.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      driver?: JwtPayload;
    }
  }
}

export const checkDriver =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isDriverExist = await Driver.findOne({
        email: verifiedToken.driver_email,
      });
      if (!isDriverExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found!!");
      }

      if (
        isDriverExist.isActive === IsActive.BLOCKED ||
        isDriverExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `
                This driver is ${isDriverExist.isActive}`
        );
      }

      if (isDriverExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Driver is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      req.driver = verifiedToken;

      next();
    } catch (error: any) {
      console.log("error at checkDriver::", error.message);
      next(error);
    }
  };
