import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../helpers/SuccessResponse";
import { User } from "./user.model";
import AppError from "../../helpers/AppError";
import { IsActive, Role } from "./user.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});

// admin route
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user?.email;

      const admin = await User.findOne({ email: email });
      if (!admin) {
        throw new AppError(404, "User not found");
      }

      if (admin.role !== Role.ADMIN) {
        throw new AppError(403, "Unauthorized you are not an admin");
      }

      const users = await User.find();

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "fetched all users",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

const blockUnblockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;

      const user = await User.findOne({ email: email });
      if (!user) {
        throw new AppError(404, "User Not found!");
      }

      if (user.isActive === IsActive.BLOCKED) {
        user.isActive = IsActive.ACTIVE;
        await user.save();
      } else {
        user.isActive = IsActive.BLOCKED;
        await user.save();
      }

      sendResponse(res, {
        success: true,
        message: `User is now ${user.isActive}`,
        statusCode: 201,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const UserControllers = {
  registerUser,
  getAllUsers,
  blockUnblockUser,
};
