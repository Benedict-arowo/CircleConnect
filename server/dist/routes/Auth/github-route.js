"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const githubRouter = express.Router();
const passport = require("passport");
githubRouter.get("/", passport.authenticate("github", { scope: ["user:email"] }));
githubRouter.get("/callback", passport.authenticate("github", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = githubRouter;
