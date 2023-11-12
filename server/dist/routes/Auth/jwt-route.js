"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const jwt_controller_1 = require("../../controllers/Auth/jwt-controller");
const argon = require("argon2");
const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");
const prisma = new client_1.PrismaClient();
const jwt = require("jsonwebtoken");
jwtRouter.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({ status: "success", user: req.user });
});
jwtRouter.post("/login", (0, wrapper_1.default)(jwt_controller_1.loginJWT));
jwtRouter.post("/register", (0, wrapper_1.default)(jwt_controller_1.registerJWT));
jwtRouter.get("/callback", passport.authenticate("jwt", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = jwtRouter;
