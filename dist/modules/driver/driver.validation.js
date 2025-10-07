"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDriverProfileValidation = void 0;
const zod_1 = require("zod");
exports.createDriverProfileValidation = zod_1.z.object({
    driver_name: zod_1.z
        .string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    driver_nid: zod_1.z
        .string({
        message: "Nid must be Bangladeshi national id card format not more than 10 digits",
    })
        .max(10, { message: "NID cannot exceed 10 characters" }),
    vehicle: zod_1.z.object({
        message: "Vehicle should be an object having things like model,licensePlate,color,year",
    }),
});
