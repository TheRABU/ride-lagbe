import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: process.env.admin_email,
    });

    if (isAdminExists) {
      console.log("Admin already exists no need to create a new one");
      return;
    }
    console.log("trying to create a admin..");

    const hashedPassword = await bcrypt.hash(
      process.env.admin_pass as string,
      Number(process.env.bcrypt_salt_round)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: process.env.admin_email,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      email: process.env.admin_email,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const adminUser = await User.create(payload);
    console.log("Admin Created Successfuly! \n");
    console.log(adminUser);
  } catch (error: any) {
    console.log("error at seedAdmin::", error.message);
    throw new error();
  }
};
