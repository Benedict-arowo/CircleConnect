import { Response } from "express";
import { Req } from "../../types";
import wrapper from "../../middlewares/wrapper";
import { loginJWT, registerJWT } from "../../controllers/Auth/jwt-controller";
import { validateBody } from "../../middlewares/validators";
import {
	userRegisterSchema,
	userLoginSchema,
} from "../../middlewares/validators/schema/auth";

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

export default jwtRouter;
