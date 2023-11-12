import { NextFunction, Response } from "express";
import { Req } from "../../types";
import CustomError from "../../middlewear/CustomError";
import { StatusCodes } from "http-status-codes";

export default (req: Req, res: Response, next: NextFunction) => {
	req.logout((err: any) => {
		if (err) throw new CustomError(err, StatusCodes.INTERNAL_SERVER_ERROR);

		res.clearCookie("jwtToken");

		res.redirect(process.env.LOGOUT_REDIRECT_ROUTE as string);
	});
};
