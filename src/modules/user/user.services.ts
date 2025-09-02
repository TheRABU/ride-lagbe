import AppError from "../../helpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(403, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

export const UserServices = {
  createUserService,
};
