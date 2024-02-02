import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import {
	MIN_PASSWORD_LENGTH,
	SCHOOL_LIST,
	TRACK_LIST,
	TrackType,
	UserSelectMinimized,
	hash,
} from "../utils";
import CustomError from "../middlewear/CustomError";
import { StatusCodes } from "http-status-codes";

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
// export const createUser = async (req: Request, res: Response) => {};

export const editUser = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { id: userId, role: userRole },
		body: {
			first_name,
			last_name,
			email,
			password,
			roleId,
			school,
			profile_picture,
			track,
		},
	} = req;

	if (!(userRole.isAdmin || userRole.canManageUsers || id === userId))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// Checks if the password meets our minimum password length requirement, and if so, hashes the password and stores it in the hashedPassword variable
	let hashedPassword;
	if (password) {
		if (password.length < MIN_PASSWORD_LENGTH)
			throw new CustomError(
				"Password must be at least " + MIN_PASSWORD_LENGTH,
				StatusCodes.BAD_REQUEST
			);
		hashedPassword = await hash(password);
	}

	// Checks if roleId has been provided meaning they want to edit the user's role, and if it has been given, it makes sure the user trying to change the role is either an admin, or has the permission to manageUsers.

	if (roleId && (userRole.isAdmin || userRole.canManageUsers)) {
		// Checks that the role being assigned to the user exists before assigning it.
		const role = await prisma.role.findUnique({
			where: {
				id: roleId,
			},
		});

		if (!role)
			throw new CustomError("Role not found.", StatusCodes.NOT_FOUND);
	} else if (roleId && !userRole.isAdmin && !userRole.canManageUsers)
		throw new CustomError(
			"YOu do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// Prevents a non admin user from changing their own role.
	if (!userRole.isAdmin && userRole.canManageUsers && userId === id)
		throw new CustomError(
			"You are not allowed to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// If user has provided a school, it ensures that it's a valid school by comparing it with school list.
	if (school && !SCHOOL_LIST.includes(school.toUpperCase()))
		throw new CustomError(
			"School provided is not valid.",
			StatusCodes.BAD_REQUEST
		);

	// If user has provided a track, it ensures that it's a valid track by comparing it with track list.
	const allTracks = [...TRACK_LIST.engineering, ...TRACK_LIST.product];
	if (track && !allTracks.includes(track.toUpperCase()))
		throw new CustomError(
			"Track provided is not valid.",
			StatusCodes.BAD_REQUEST
		);

	const user = await prisma.user.update({
		where: { id },
		data: {
			first_name: first_name ? first_name : undefined,
			last_name: last_name ? last_name : undefined,
			email: email ? email : undefined,
			password: password ? hashedPassword : undefined,
			roleId: roleId ? roleId : undefined,
			school: school
				? (school.toUpperCase() as "ENGINEERING")
				: undefined,
			profile_picture: profile_picture ? profile_picture : undefined,
			track: track ? (track.toUpperCase() as TrackType) : undefined,
		},
	});

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

	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			role: true,
		},
	});

	if (!user) throw new CustomError("User not found.", StatusCodes.NOT_FOUND);

	if (user.role.isAdmin)
		throw new CustomError(
			"You cannot perform this action on this user. Remove their administrator role before being able to remove them.",
			StatusCodes.BAD_REQUEST
		);

	await prisma.user.delete({
		where: { id },
	});

	res.status(StatusCodes.NO_CONTENT).json({ success: true });
};
