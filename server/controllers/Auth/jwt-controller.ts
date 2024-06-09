import { StatusCodes } from "http-status-codes";
import CustomError from "../../middlewares/CustomError";
import { Req } from "../../types";
import { Response } from "express";
import prisma from "../../model/db";
import { Prisma } from "@prisma/client";
import { findUser } from "../../model/auth";
import {
	ACCESS_TOKEN_VALIDITY_TIME,
	DEFAULT_MEMBER_ROLE_ID,
	JWT_ACCESS_TOKEN_EXPIRY,
	hash,
	tokenGenerator,
	verifyHash,
} from "../../utils";

const argon = require("argon2");
const jwt = require("jsonwebtoken");

export const loginJWT = async (req: Req, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError(
			"Email, and password must be provided.",
			StatusCodes.BAD_REQUEST
		);
	}
	const User = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			profile_picture: true,
			role: true,
			password: true,
			circle: true,
		},
	});

	if (!User) {
		throw new CustomError("User not found.", StatusCodes.NOT_FOUND);
	}

	if (!User.password)
		throw new CustomError(
			"Try using google or github to sign into this account.",
			StatusCodes.BAD_REQUEST
		);

	let passwordIsValid = await verifyHash(User.password, password);
	console.log(passwordIsValid);
	// TODO: fix the verifyHash function, and replace it with the function above.
	// passwordIsValid = await argon.verify(User.password, password);

	if (passwordIsValid) {
		const token = await tokenGenerator(
			{ id: User.id },
			ACCESS_TOKEN_VALIDITY_TIME
		);

		if (process.env.NODE_ENV?.toString() === "PRODUCTION") {
			return res
				.cookie("jwtToken", token, {
					maxAge: JWT_ACCESS_TOKEN_EXPIRY,
					httpOnly: true,
					secure: true,
					sameSite: "none",
					path: "/",
				})
				.status(StatusCodes.OK)
				.json({
					success: true,
					message: "Successfully logged in.",
					data: {
						...User,
						password: null,
						token: token,
					},
				});
		} else {
			return res
				.cookie("jwtToken", token, {
					maxAge: JWT_ACCESS_TOKEN_EXPIRY,
					httpOnly: true,
					secure: false,
					path: "/",
					sameSite: "strict",
				})
				.status(StatusCodes.OK)
				.json({
					success: true,
					message: "Successfully logged in.",
					data: {
						...User,
						password: null,
						token: token,
					},
				});
		}
	} else {
		throw new CustomError(
			"Invalid password provided.",
			StatusCodes.BAD_REQUEST
		);
	}
};

export const registerJWT = async (req: Req, res: Response) => {
	const { email, password, first_name, last_name } = req.body;
	if (!email || !password || !first_name || !last_name) {
		throw new CustomError(
			"Email, password, last name, and first name must be provided.",
			StatusCodes.BAD_REQUEST
		);
	}

	try {
		const hashedPassword = await hash(password);

		const User = await prisma.user.create({
			data: {
				email,
				first_name,
				last_name,
				password: hashedPassword,
				roleId: DEFAULT_MEMBER_ROLE_ID,
			},
		});

		const token = await tokenGenerator({ id: User.id }, "1h");

		if (process.env.NODE_ENV?.toString() === "PRODUCTION") {
			return res
				.cookie("jwtToken", token, {
					httpOnly: true,
					maxAge: JWT_ACCESS_TOKEN_EXPIRY,
					secure: true,
					path: "/",
					sameSite: "none",
				})
				.status(StatusCodes.CREATED)
				.json({
					success: true,
					message: "Successfully registered user.",
					data: {
						...User,
						password: undefined,
						token: token,
					},
				});
		} else {
			return res
				.cookie("jwtToken", token, {
					httpOnly: true,
					maxAge: JWT_ACCESS_TOKEN_EXPIRY,
				})
				.status(StatusCodes.CREATED)
				.json({
					success: true,
					message: "Successfully registered user.",
					data: {
						...User,
						password: undefined,
						token: token,
					},
				});
		}
	} catch (e: any) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			// IF the error is coming from prisma, and that it's a unique field error...
			if (e.code === "P2002") {
				throw new CustomError(
					"A user with this email already exists!",
					StatusCodes.BAD_REQUEST
				);
			}
		} else {
			throw new CustomError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
};
