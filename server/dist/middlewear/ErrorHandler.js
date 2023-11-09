"use strict";
// Inside the error, I'm expecting
// Error Message
// An error code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ErrorHandler = (err, req, res, next) => {
    let { code, message } = err;
    // If the error is not an instance of the CustomError class meaning it won't have a code property.
    if (!(err instanceof CustomError_1.default)) {
        return res.status(404).json({
            success: false,
            message: process.env.DEFAULT_ERROR_MESSAGE,
            stack: process.env.NODE_ENV === "dev" ? err.stack : null,
        });
    }
    return res.status(code || 404).json({
        success: false,
        message: message || process.env.DEFAULT_ERROR_MESSAGE,
        stack: process.env.NODE_ENV === "dev" ? err.stack : null,
    });
};
exports.default = ErrorHandler;
