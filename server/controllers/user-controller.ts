import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import { UserSelectMinimized } from "../utils";
import CustomError from "../middlewear/CustomError";
import { StatusCodes } from "http-status-codes";
import {
	CreateUserService,
	DeleteUserService,
	EditUserService,
} from "../service/user.service";

export const getUsers = async (req: Req, res: Response) => {
	const users = await prisma.user.findMany({
		where: {},
		select: UserSelectMinimized,
	});

	res.json({ success: true, data: users });
};

export const getUser = async (req: Req, res: Response) => {
	const {
		params: { id },
	} = req;

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			email: true,
			id: true,
			profile_picture: true,
			first_name: true,
			projects: {
				select: {
					id: true,
					name: true,
					circle: true,
				},
			},
			role: {
				select: {
					id: true,
					name: true,
				},
			},
			track: true,
			school: true,
			coleadOf: true,
			leadOf: true,
			memberOf: true,
			joined: true,
			createdAt: true,
			pendingRequest: true,
			projectRatings: true,
		},
	});

	if (!user) throw new CustomError("User not found.", StatusCodes.NOT_FOUND);

	res.json({ success: true, data: user });
};

// TODO: createUser route
export const createUser = async (req: Req, res: Response) => {
	const {
		user: { id: userId, role: userRole },
	} = req;

	if (!(userRole.isAdmin || userRole.canManageUsers))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const newUser = CreateUserService({ body: req.body });
	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, data: newUser });
};

export const editUser = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { id: userId, role: userRole },
	} = req;

	if (!(userRole.isAdmin || userRole.canManageUsers || id === userId))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const user = EditUserService({ user: req.user, id, body: req.body });
	return res.status(StatusCodes.OK).json({ success: true, data: user });
};

export const deleteUser = async (req: Req, res: Response) => {
	const {
		user: { role: userRole },
		params: { id },
	} = req;

	// Only allows admin, people who can manage users, and if a user is trying to delete their own account.
	if (!(userRole.isAdmin || userRole.canManageUsers || req.user.id === id))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	await DeleteUserService(id);

	res.status(StatusCodes.NO_CONTENT).json({ success: true });
};
