import { Router } from "express";
import { UserControllers } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/create", UserControllers.registerUser);

export default userRoutes;
