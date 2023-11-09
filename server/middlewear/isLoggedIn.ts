import { NextFunction, Request, Response } from "express";
import { Req } from "../types";
import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const isLoggedIn = (req: Req, res: Response, next: NextFunction) => {
	if (!req.user) {
		throw new CustomError(
			"You must be authenticated to access this route.",
			StatusCodes.UNAUTHORIZED
		);
	}
	next();
};

export default isLoggedIn;
