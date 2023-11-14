// Inside the error, I'm expecting
// Error Message
// An error code

import { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError";
import dotenv from "dotenv";
dotenv.config();

const ErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let { code, message } = err;

	// If the error is not an instance of the CustomError class meaning it won't have a code property.
	if (!(err instanceof CustomError)) {
		return res.status(404).json({
			success: false,
			message: process.env.DEFAULT_ERROR_MESSAGE,
			stack: process.env.NODE_ENV === "test" ? err.stack : null,
		});
	}
	return res.status(code || 404).json({
		success: false,
		message: message || process.env.DEFAULT_ERROR_MESSAGE,
		stack: process.env.NODE_ENV === "test" ? err.stack : null,
	});
};

export default ErrorHandler;
