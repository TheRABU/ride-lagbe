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
exports.seedAdmin = void 0;
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExists = yield user_model_1.User.findOne({
            email: process.env.admin_email,
        });
        if (isAdminExists) {
            console.log("Admin already exists no need to create a new one");
            return;
        }
        console.log("trying to create a admin..");
        const hashedPassword = yield bcryptjs_1.default.hash(process.env.admin_pass, Number(process.env.bcrypt_salt_round));
        const authProvider = {
            provider: "credentials",
            providerId: process.env.admin_email,
        };
        const payload = {
            name: "Admin",
            role: user_interface_1.Role.ADMIN,
            email: process.env.admin_email,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider],
        };
        const adminUser = yield user_model_1.User.create(payload);
        console.log("Admin Created Successfuly! \n");
        console.log(adminUser);
    }
    catch (error) {
        console.log("error at seedAdmin::", error.message);
        throw new error();
    }
});
exports.seedAdmin = seedAdmin;
