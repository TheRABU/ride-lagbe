import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../helpers/SuccessResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});

export const UserControllers = {
  registerUser,
};
