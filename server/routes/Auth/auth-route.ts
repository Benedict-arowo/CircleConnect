import { NextFunction, Request, Response } from "express";
import wrapper from "../../middlewear/wrapper";
import { Req } from "../../types";
import isLoggedIn from "../../middlewear/isLoggedIn";

require("dotenv").config();

const express = require("express");
const router = express.Router();

router.route("/login").get(
	wrapper((req: Request, res: Response) => {
		return res.json({ message: "Login" });
	})
);

router.get("/user", isLoggedIn, async (req: Req, res: Response) => {
	let user = req.user;
	res.status(200).json(user);
});

router.get(
	"/logout",
	isLoggedIn,
	(req: Req, res: Response, next: NextFunction) => {
		req.logout((err: any) => {
			if (err) next(err);
			res.redirect(process.env.LOGOUT_REDIRECT_ROUTE as string);
		});
	}
);

export default router;
