import { Request, Response } from "express";
import wrapper from "../middlewear/wrapper";
import { Req } from "../types";
import isLoggedIn from "../middlewear/isLoggedIn";

const passport = require("passport");
const express = require("express");
const router = express.Router();

router.route("/login").get(
	wrapper((req: Request, res: Response) => {
		return res.json({ message: "Login" });
	})
);

router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req: Request, res: Response) {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

router.get("/logout", isLoggedIn, (req: Req, res: Response) => {
	req.logout();
	res.redirect("/");
});

export default router;
