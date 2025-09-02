import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const rideRoutes = Router();

rideRoutes.post("/request", RideController.requestRide);

export default rideRoutes;
