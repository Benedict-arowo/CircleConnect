import { NextFunction, Request, Response } from "express";
import { Req } from "../types";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.redirect("/login");
	}
	next();
};

export default isLoggedIn;
