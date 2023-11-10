import { Request, Response } from "express";
import { Req } from "../../types";
import CustomError from "../../middlewear/CustomError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { Prisma, PrismaClient } from "@prisma/client";
import wrapper from "../../middlewear/wrapper";

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

jwtRouter.post(
	"/login",
	wrapper(async (req: Req, res: Response) => {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new CustomError(
				"Email, and password must be provided.",
				StatusCodes.BAD_REQUEST
			);
		}

		const User = await prisma.user.findUnique({
			where: { email },
		});

		if (!User) {
			throw new CustomError("User not found.", StatusCodes.BAD_REQUEST);
		}

		if (!User.password)
			throw new CustomError(
				"Try using google or github to sign into this account.",
				StatusCodes.BAD_REQUEST
			);

		let passwordIsValid = await argon.verify(User.password, password);
		console.log(password);
		console.log(passwordIsValid);
		if (passwordIsValid) {
			const token = jwt.sign(
				{
					id: User.id,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);
			return res
				.cookie("jwtToken", token, { httpOnly: true })
				.status(StatusCodes.ACCEPTED)
				.json({
					success: true,
					message: "Successfully logged in.",
					data: {
						...User,
						password: null,
					},
				});
		} else {
			throw new CustomError(
				"Invalid password provided.",
				StatusCodes.BAD_REQUEST
			);
		}
	})
);

jwtRouter.post(
	"/register",
	wrapper(async (req: Req, res: Response) => {
		console.log(req.body);
		const { email, password, first_name, last_name } = req.body;
		if (!email || !password) {
			throw new CustomError(
				"Email, and password must be provided.",
				StatusCodes.BAD_REQUEST
			);
		}

		if (!first_name || !last_name)
			throw new CustomError(
				"First name and last name must be provided.",
				StatusCodes.BAD_REQUEST
			);
		// Todo: Make sure password is strong.
		const hashedPassword = await argon.hash(password);
		try {
			const User = await prisma.user.create({
				data: {
					email,
					first_name,
					last_name,
					password: hashedPassword,
				},
			});

			const token = jwt.sign(
				{
					id: User.id,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);

			return res
				.cookie("jwtToken", token, { httpOnly: true })
				.status(StatusCodes.ACCEPTED)
				.json({
					success: true,
					message: "Successfully registered user.",
					data: {
						...User,
						password: undefined,
						token: token,
					},
				});
		} catch (e: any) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					throw new CustomError(
						"A user with this email already exists!",
						StatusCodes.BAD_REQUEST
					);
				}
			} else {
				throw new CustomError(
					e.message,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}
		}
	})
);

jwtRouter.get(
	"/callback",
	passport.authenticate("jwt", { failureRedirect: "/login" }),
	function (req: Req, res: Response) {
		// Successful authentication, redirect home.
		res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE as string);
	}
);

export default jwtRouter;
