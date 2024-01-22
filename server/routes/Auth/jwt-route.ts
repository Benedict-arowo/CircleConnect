/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */

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
	}
);

/**
 * @swagger
 * /auth/jwt/login:
 *   post:
 *     summary: Log in with email and password to obtain JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns the user data and a JWT token in the cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the login was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully logged in."
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request. Indicates missing email or password, or invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingEmailOrPassword:
 *                 value:
 *                   status: false
 *                   message: "Email, and password must be provided."
 *               invalidPassword:
 *                 value:
 *                   status: false
 *                   message: "Invalid password provided."
 *               invalidSignInMethod:
 *                 value:
 *                   status: false
 *                   message: "Try using google or github to sign into this account."
 *       404:
 *         description: Bad Request. Indicates user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingEmailOrPassword:
 *                 value:
 *                   status: false
 *                   message: "User not found."
 */
jwtRouter.post("/login", wrapper(loginJWT));

/**
 * @swagger
 * /auth/jwt/register:
 *   post:
 *     summary: Register a new user and obtain JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *                 description: User's password.
 *               first_name:
 *                 type: string
 *                 example: John
 *                 description: User's first name.
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: User's last name.
 *     responses:
 *       201:
 *         description: Successfully registered user. Returns the user data and a JWT token in the cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the registration was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully registered user."
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request. Indicates missing email, password, first name, or last name, or a user with the provided email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 value:
 *                   status: false
 *                   message: "Email, password, last name, and first name must be provided."
 *               userExists:
 *                 value:
 *                   status: false
 *                   message: "A user with this email already exists!"
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during user registration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 */
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
