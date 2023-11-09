"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
const status_codes_1 = require("http-status-codes/build/cjs/status-codes");
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        throw new CustomError_1.default("You must be authenticated to access this route.", status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    next();
};
exports.default = isLoggedIn;
