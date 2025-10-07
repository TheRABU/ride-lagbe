import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);


app.get("/", (req:Request, res:Response) => {
  res.status(200).json({  
    message: "Server is live and running successfully",
  });
});

export default app;
