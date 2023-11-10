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
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const isLoggedIn_1 = __importDefault(require("../../middlewear/isLoggedIn"));
const CustomError_1 = __importDefault(require("../../middlewear/CustomError"));
const http_status_codes_1 = require("http-status-codes");
require("dotenv").config();
const express = require("express");
const router = express.Router();
router.route("/login").get((0, wrapper_1.default)((req, res) => {
    return res.json({ message: "Login" });
}));
router.get("/user", isLoggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    res.status(200).json(user);
}));
router.get("/logout", isLoggedIn_1.default, (req, res, next) => {
    res.clearCookie("jwtToken");
    req.logout((err) => {
        if (err)
            throw new CustomError_1.default(err, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        res.clearCookie("jwtToken");
        res.redirect(process.env.LOGOUT_REDIRECT_ROUTE);
    });
});
exports.default = router;
