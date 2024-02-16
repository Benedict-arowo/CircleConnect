import { Response } from "express";
import { Req } from "../../types";
import wrapper from "../../middlewear/wrapper";
import { loginJWT, registerJWT } from "../../controllers/Auth/jwt-controller";

const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");

jwtRouter.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req: Req, res: Response) => {
		return res.json({ status: "success", user: req.user });
	},
);

jwtRouter.post("/login", wrapper(loginJWT));

jwtRouter.post("/register", wrapper(registerJWT));

jwtRouter.get(
	"/callback",
	passport.authenticate("jwt", {
		failureRedirect: process.env.FAILURE_REDIRECT || "/",
	}),
	function (req: Req, res: Response) {
		// Successful authentication, redirect home.
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	},
);

export default jwtRouter;
