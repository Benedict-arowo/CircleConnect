import { NextFunction, Response } from "express";
import { Req, User } from "../types";
import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const passport = require("passport");

const isLoggedIn = (req: Req, res: Response, next: NextFunction) => {
	// Check if the user is already authenticated via Google or GitHub
	if (req.user) {
		next();
	} else {
		// Attempt to authenticate using 'jwt' strategy
		passport.authenticate(
			"jwt",
			{ session: false },
			(err: any, user: User, info: any) => {
				console.log("jwt authentication attempt");

				if (err) {
					// Handle errors, e.g., invalid token, expired token, etc.
					next(
						new CustomError(
							"Authentication failed",
							StatusCodes.UNAUTHORIZED,
						),
					);
				}

				if (!user) {
					// If 'jwt' authentication fails, throw an error
					console.log("jwt authentication failed");
					next(
						new CustomError(
							"You must be authenticated to access this route.",
							StatusCodes.UNAUTHORIZED,
						),
					);
				}

				// If 'jwt' authentication is successful, store the user in req.user
				req.user = user;
				console.log("jwt authentication succeeded");
				next();
			},
		)(req, res, next); // Invoke the middleware function returned by passport.authenticate
	}
};

export default isLoggedIn;
