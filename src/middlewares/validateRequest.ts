import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      console.log("✅ Validation passed");
      next();
    } catch (error: any) {
      console.error("❌ Validation failed:", error.message);
      next(error);
    }
  };
