"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const isLoggedIn_1 = __importDefault(require("../middlewear/isLoggedIn"));
const passport = require("passport");
const express = require("express");
const router = express.Router();
router.route("/login").get((0, wrapper_1.default)((req, res) => {
    return res.json({ message: "Login" });
}));
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
router.get("/logout", isLoggedIn_1.default, (req, res) => {
    req.logout();
    res.redirect("/");
});
exports.default = router;
