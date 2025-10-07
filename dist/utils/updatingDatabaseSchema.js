"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchemas = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Driver schema (only required fields for migration)
const driverSchema = new mongoose_1.default.Schema({}, { strict: false });
const userSchema = new mongoose_1.default.Schema({}, { strict: false });
const Driver = mongoose_1.default.model("Driver", driverSchema, "drivers");
const User = mongoose_1.default.model("User", userSchema, "users");
const updateSchemas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update drivers
        const driverResult = yield Driver.updateMany({ isBlocked: { $exists: false } }, { $set: { isBlocked: false, isService: "APPROVED" } });
        // Update users
        // const userResult = await User.updateMany(
        //   { isBlocked: { $exists: false } },
        //   { $set: { isBlocked: false } }
        // );
        console.log("Drivers updated:", driverResult.modifiedCount);
        // console.log("Users updated:", userResult.modifiedCount);
        process.exit(0);
    }
    catch (error) {
        console.log("error at updating util::", error.message);
        process.exit(1);
    }
});
exports.updateSchemas = updateSchemas;
