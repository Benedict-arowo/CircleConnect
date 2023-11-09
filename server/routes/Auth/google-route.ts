import { Request, Response } from "express";

require("dotenv").config();

const passport = require("passport");
const express = require("express");
const googleRouter = express.Router();

googleRouter.get(
	"/",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRouter.get(
	"/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req: Request, res: Response) {
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	}
);

export default googleRouter;
