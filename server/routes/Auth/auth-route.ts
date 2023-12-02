import { NextFunction, Request, Response } from "express";
import wrapper from "../../middlewear/wrapper";
import { Req } from "../../types";
import isLoggedIn from "../../middlewear/isLoggedIn";
import { StatusCodes } from "http-status-codes";
import logout from "../../controllers/Auth/logout";
import prisma from "../../model/db";
import { UserSelectFull, UserSelectMinimized } from "../../utils";

require("dotenv").config();

const express = require("express");
const router = express.Router();

router.get(
	"/user",
	isLoggedIn,
	wrapper(async (req: Req, res: Response) => {
		// TODO: This route is currently just for testing purposes.
		let user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: UserSelectFull,
		});

		res.status(StatusCodes.OK).json(user);
	})
);

router.get("/logout", isLoggedIn, wrapper(logout));

export default router;
