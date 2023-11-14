"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const isLoggedIn_1 = __importDefault(require("../middlewear/isLoggedIn"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const router = express.Router();
router.route("/login").get((0, wrapper_1.default)((req, res) => {
    return res.json({ message: "Login" });
}));
router.get("/user", (req, res) => {
    res.status(200).json(req.user);
});
router.get("/logout", isLoggedIn_1.default, (req, res, next) => {
    req.logout((err) => {
        if (err)
            next(err);
        res.redirect(process.env.LOGOUT_REDIRECT_ROUTE);
    });
});
exports.default = router;
