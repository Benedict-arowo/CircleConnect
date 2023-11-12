import { Request, Response } from "express";
import { Req } from "../../types";
import CustomError from "../../middlewear/CustomError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { Prisma, PrismaClient } from "@prisma/client";
import wrapper from "../../middlewear/wrapper";
import { loginJWT, registerJWT } from "../../controllers/Auth/jwt-controller";

const argon = require("argon2");
const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

jwtRouter.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req: Req, res: Response) => {
		return res.json({ status: "success", user: req.user });
	}
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
	}
);

export default jwtRouter;
