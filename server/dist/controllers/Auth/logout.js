"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../../middlewear/CustomError"));
const http_status_codes_1 = require("http-status-codes");
exports.default = (req, res, next) => {
    req.logout((err) => {
        if (err)
            throw new CustomError_1.default(err, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        res.clearCookie("jwtToken");
        res.redirect(process.env.LOGOUT_REDIRECT_ROUTE);
    });
};
