import { Response } from "express";
import { Req } from "../../types";
import wrapper from "../../middlewares/wrapper";
import {
	changePassword,
	forgotPassword,
	loginJWT,
	registerJWT,
	resetPassword,
} from "../../controllers/auth/jwt-controller";
import { validateBody } from "../../middlewares/validators";
import {
	userRegisterSchema,
	userLoginSchema,
	changePasswordSchema,
	resetPasswordSchema,
	forgotPasswordSchema,
} from "../../middlewares/validators/schema/auth";
import isLoggedIn from "../../middlewares/isLoggedIn";

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

jwtRouter.post("/login", validateBody(userLoginSchema), wrapper(loginJWT));

jwtRouter.post(
	"/register",
	validateBody(userRegisterSchema),
	wrapper(registerJWT)
);

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

jwtRouter.post(
	"/change-password",
	isLoggedIn,
	validateBody(changePasswordSchema),
	wrapper(changePassword)
);

jwtRouter.post(
	"/forgot-password",
	isLoggedIn,
	validateBody(forgotPasswordSchema),
	wrapper(forgotPassword)
);

jwtRouter.post(
	"/reset-password",
	isLoggedIn,
	validateBody(resetPasswordSchema),
	wrapper(resetPassword)
);

export default jwtRouter;
