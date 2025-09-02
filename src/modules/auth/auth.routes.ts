import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", AuthController.credentialsLogin);
authRoutes.post("/logout", AuthController.logOut);
authRoutes.post("/refresh-token", AuthController.getNewAccessToken);

export default authRoutes;
