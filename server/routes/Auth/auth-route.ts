import wrapper from "../../middlewear/wrapper";
import isLoggedIn from "../../middlewear/isLoggedIn";
import logout from "../../controllers/Auth/logout";
import { Req } from "../../types";
import { UserSelectFull } from "../../utils";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../model/db";

require("dotenv").config();

const express = require("express");
const router = express.Router();

router.get(
	"/activeUser",
	isLoggedIn,
	wrapper(async (req: Req, res: Response) => {
		// TODO: This route is currently just for testing purposes.
		let user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: UserSelectFull,
		});

		res.status(StatusCodes.OK).json(user);
	}),
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out user and clear session
 *     tags:
 *       - Authentication
 *     description: Logs out the user, clears the JWT token cookie, and redirects to the configured logout redirect route.
 *     responses:
 *       200:
 *         description: Successfully logged user out.
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
