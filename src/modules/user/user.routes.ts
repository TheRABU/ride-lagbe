import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRoutes = Router();

userRoutes.post("/create", UserControllers.registerUser);
userRoutes.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

//admin
userRoutes.patch(
  "/block-unblock/:email",
  checkAuth(Role.ADMIN),
  UserControllers.blockUnblockUser
);

export default userRoutes;
