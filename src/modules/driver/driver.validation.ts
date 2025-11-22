import { z } from "zod";

export const createDriverProfileValidation = z.object({
  driver_name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  driver_nid: z
    .string({
      message:
        "Nid must be Bangladeshi national id card format not more than 10 digits",
    })
    .max(10, { message: "NID cannot exceed 10 characters" }),
  vehicle: z.object({
    model: z.string(),
    licensePlate: z.string(),
    color: z.string(),
    year: z.number(),
  }),
});
