/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */

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

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out user and clear session
 *     tags:
 *       - Authentication
 *     description: Logs out the user, clears the JWT token cookie, and redirects to the configured logout redirect route.
 *     responses:
 *       302:
 *         description: Redirects to the configured logout redirect route after successful logout.
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during the logout process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/Error"
 *             example:
 *               status: error
 *               message: Internal Server Error
 */

router.get("/logout", isLoggedIn, wrapper(logout));

export default router;
