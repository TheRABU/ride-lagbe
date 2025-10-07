"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connectDB_1 = require("./db/connectDB");
const seedAdmin_1 = require("./utils/seedAdmin");
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log("Server has started and running sir!!");
    (0, connectDB_1.connectDatabase)();
    (0, seedAdmin_1.seedAdmin)();
});
