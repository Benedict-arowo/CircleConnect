import { Response } from "express";
import { Req } from "../../types";
import wrapper from "../../middlewares/wrapper";
import { loginJWT, registerJWT } from "../../controllers/Auth/jwt-controller";
import {
	validateJWTLogin,
	validateJWTRegister,
} from "../../middlewares/validators";

const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");

jwtRouter.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req: Req, res: Response) => {
		return res.json({ status: "success", user: req.user });
	}
);

jwtRouter.post("/login", validateJWTLogin, wrapper(loginJWT));

jwtRouter.post("/register", validateJWTRegister, wrapper(registerJWT));

jwtRouter.get(
	"/callback",
	passport.authenticate("jwt", {
		failureRedirect: process.env.FAILURE_REDIRECT || "/",
	}),
	function (req: Req, res: Response) {
		// Successful authentication, redirect home.
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	}
);

export default jwtRouter;
