import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import rideRoutes from "../modules/ride/ride.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/rides",
    route: rideRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
