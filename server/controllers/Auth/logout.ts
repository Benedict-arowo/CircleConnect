import { NextFunction, Response } from "express";
import { Req } from "../../types";
import CustomError from "../../middlewares/CustomError";
import { StatusCodes } from "http-status-codes";

export default (req: Req, res: Response, next: NextFunction) => {
	req.logout((err: any) => {
		if (err) throw new CustomError(err, StatusCodes.INTERNAL_SERVER_ERROR);

		res.clearCookie("jwtToken");

		// Sends an http response instead of redirecting
		// res.redirect(process.env.LOGOUT_REDIRECT_ROUTE as string);
		res.status(StatusCodes.OK).json({ success: true });
	});
};
