import { Response } from "express";
import { Req } from "../../types";

const express = require("express");
const githubRouter = express.Router();
const passport = require("passport");

githubRouter.get(
	"/",
	passport.authenticate("github", { scope: ["user:email"] })
);

githubRouter.get(
	"/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req: Req, res: Response) {
		// Successful authentication, redirect home.
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	}
);

export default githubRouter;
