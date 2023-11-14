"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const googleRouter = express.Router();
googleRouter.get("/", passport.authenticate("google", { scope: ["email", "profile"] }));
googleRouter.get("/callback", passport.authenticate("google", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = googleRouter;
