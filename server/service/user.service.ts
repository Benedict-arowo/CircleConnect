import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";
import {
	DEFAULT_MEMBER_ROLE_ID,
	MIN_PASSWORD_LENGTH,
	SCHOOL_LIST,
	TRACK_LIST,
	TrackType,
	hash,
} from "../utils";
import prisma from "../model/db";
import { User } from "../types";

type UserArgs = {
	body: {
		first_name?: string;
		last_name?: string;
		email?: string;
		password?: string;
		roleId?: string;
		school?: string;
		profile_picture?: string;
		track?: string;
	};
};

type EditUserArgs = {
	id: string;
	body: UserArgs["body"];
	user: User;
};

export const CreateUserService = async ({ body }: UserArgs) => {
	const {
		first_name,
		last_name,
		email,
		password,
		roleId,
		school,
		profile_picture,
		track,
	} = body;

	if (!first_name || !last_name)
		throw new CustomError(
			"First and last names must be provided.",
			StatusCodes.BAD_REQUEST
		);
	if (!email || !password)
		throw new CustomError(
			"Email and password must be provided.",
			StatusCodes.BAD_REQUEST
		);
	if (password.length < MIN_PASSWORD_LENGTH)
		throw new CustomError(
			"Password must be at least " + MIN_PASSWORD_LENGTH,
			StatusCodes.BAD_REQUEST
		);
	if (!school)
		throw new CustomError(
			"School must be provided.",
			StatusCodes.BAD_REQUEST
		);
	if (!track)
		throw new CustomError(
			"Track must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (roleId) {
		const role = await prisma.role.findUnique({ where: { id: roleId } });
		if (!role)
			throw new CustomError("Invalid role id.", StatusCodes.BAD_REQUEST);
	}

	const hashedPassword = await hash(password);

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

	try {
		const newUser = await prisma.user.create({
			data: {
				first_name,
				last_name,
				email,
				password: hashedPassword,
				profile_picture: profile_picture ? profile_picture : undefined,
				roleId: roleId ? roleId : DEFAULT_MEMBER_ROLE_ID,
				school: school
					? (school.toUpperCase() as "ENGINEERING")
					: undefined,
				track: track ? (track.toUpperCase() as TrackType) : undefined,
			},
			select: {
				email: true,
				id: true,
				profile_picture: true,
				first_name: true,
				last_name: true,
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
				joined: true,
				createdAt: true,
				projectRatings: true,
			},
		});

		return newUser;
	} catch (error: any) {
		console.log(error);

		if (error.code === "P2002" && error.meta.target.includes("email")) {
			throw new CustomError(
				"User with email already exists.",
				StatusCodes.BAD_REQUEST
			);
		}
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
};

export const EditUserService = async ({ body, user, id }: EditUserArgs) => {
	const {
		first_name,
		last_name,
		email,
		password,
		roleId,
		school,
		profile_picture,
		track,
	} = body;

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

	if (roleId && (user.role.isAdmin || user.role.canManageUsers)) {
		// Checks that the role being assigned to the user exists before assigning it.
		const role = await prisma.role.findUnique({
			where: {
				id: roleId,
			},
		});

		if (!role)
			throw new CustomError("Role not found.", StatusCodes.NOT_FOUND);
	} else if (roleId && !user.role.isAdmin && !user.role.canManageUsers)
		throw new CustomError(
			"YOu do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// Prevents a non admin user from changing their own role.
	if (!user.role.isAdmin && user.role.canManageUsers && user.id === id)
		throw new CustomError(
			"You are not allowed to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// If user has provided a school, it ensures that it's a valid school by comparing it with school list.
	if (school && !SCHOOL_LIST.includes(school.toString().toUpperCase()))
		throw new CustomError(
			"School provided is not valid.",
			StatusCodes.BAD_REQUEST
		);

	// If user has provided a track, it ensures that it's a valid track by comparing it with track list.
	const allTracks = [...TRACK_LIST.engineering, ...TRACK_LIST.product];
	if (track && !allTracks.includes(track.toString().toUpperCase()))
		throw new CustomError(
			"Track provided is not valid.",
			StatusCodes.BAD_REQUEST
		);

	const updatedUser = await prisma.user.update({
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
		select: {
			email: true,
			id: true,
			profile_picture: true,
			first_name: true,
			last_name: true,
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
			joined: true,
			createdAt: true,
			projectRatings: true,
		},
	});

	return updatedUser;
};

export const DeleteUserService = async (id: string) => {
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

	return 0;
};
