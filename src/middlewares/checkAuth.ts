import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

// Extend Express Request interface to include 'user' this could be used in a separate interface folder as well.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization;
      // const accessToken = req.header("Authorization")?.replace("Bearer ", "");
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError(404, "Could not found verifiedTOken");
      }
      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      // if (!isUserExist.isVerified) {
      //   throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
      // }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      // if user also a driver

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
