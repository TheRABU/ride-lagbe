import AppError from "../../helpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }
  // const jwtPayload = {
  //     userId: isUserExist._id,
  //     email: isUserExist.email,
  //     role: isUserExist.role
  // }
  // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

  // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

  const userTokens = createUserTokens(isUserExist);

  // delete isUserExist.password;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  // const verifiedRefreshToken = verifyToken(
  //   refreshToken,
  //   process.env.JWT_REFRESH_SECRET as string
  // ) as JwtPayload;

  // const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  // if (!isUserExist) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Could not find user with the email, User does not exist try creating a user first!"
  //   );
  // }

  // if (
  //   isUserExist.isActive === isActive.BLOCKED ||
  //   isUserExist.isActive === isActive.INACTIVE
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `User is: ${isUserExist.isActive}`
  //   );
  // }
  // if (isUserExist.isDeleted) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted!");
  // }

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   process.env.WT_REFRESH_TOKEN as string,
  //   process.env.JWT_REFRESH_EXPIRES as string
  // );
  // return {
  //   accessToken,
  // };

  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
