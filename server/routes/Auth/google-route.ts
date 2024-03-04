import { Request, Response } from "express";

require("dotenv").config();

const passport = require("passport");
const express = require("express");
const googleRouter = express.Router();

googleRouter.get(
	"/",
	passport.authenticate("google", { scope: ["email", "profile"] }),
);

googleRouter.get(
	"/callback",
	passport.authenticate("google", {
		failureRedirect: process.env.FAILURE_REDIRECT || "/",
	}),
	function (req: Request, res: Response) {
		// Successful authentication, redirect home.
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	},
);

export default googleRouter;
