import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewares/CustomError";
import {
	ACCESS_TOKEN_VALIDITY_TIME,
	DEFAULT_MEMBER_ROLE_ID,
	MIN_PASSWORD_LENGTH,
	SCHOOL_LIST,
	TRACK_LIST,
	TrackType,
	hash,
	tokenGenerator,
	verifyHash,
	verifyToken,
} from "../utils";
import prisma from "../model/db";
import { User } from "../types";
import mailService from "./messaging.service";
import { User as PUser } from "@prisma/client";

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
				coleadOf: true,
				leadOf: true,
				memberOf: true,
				joined: true,
				createdAt: true,
				pendingRequest: true,
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
			coleadOf: true,
			leadOf: true,
			memberOf: true,
			joined: true,
			createdAt: true,
			pendingRequest: true,
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

export const changePasswordService = async (
	id: string,
	payload: {
		oldPassword: string;
		newPassword: string;
	}
): Promise<Boolean> => {
	const { oldPassword, newPassword } = payload;

	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user || !user.password) {
		throw new CustomError("User not found", StatusCodes.NOT_FOUND);
	}

	const passwordIsValid = await verifyHash(user.password, oldPassword);
	if (passwordIsValid) {
		const hashedPassword = await hash(newPassword);
		const updatedUser = await prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
		});
		return updatedUser && true;
	}
	return false;
};

export const forgotPasswordService = async (
	email: string
): Promise<Boolean> => {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user || !user.password) {
		// Oauth users do not have password
		throw new CustomError("User not found", StatusCodes.NOT_FOUND);
	}
	const res = tokenGenerator(
		{ id: user.id, firstName: user.first_name, email: user.email },
		"10m"
	);
	console.log(res);
	// Call MAIL service and send RESET code
	// to user's email address

	if (true) {
		return true;
	}
	return false;
};

export const resetPasswordService = async (
	id: string,
	payload: {
		token: string;
		newPassword: string;
	}
): Promise<Boolean> => {
	const { token, newPassword } = payload;

	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user || !user.password) {
		throw new CustomError("User not found", StatusCodes.NOT_FOUND);
	}

	const hashedPassword = await hash(newPassword);
	const updatedUser = await prisma.user.update({
		where: { id },
		data: { password: hashedPassword },
	});
	return updatedUser && true;
};

interface IUser {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	password?: string;
	roleId: string;
	school: string;
	profile_picture: string;
	track: string;
}
class UserService {
	private async findUserById(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
		});
		if (!user || !user.password) {
			// Oauth users do not have password
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}
		return user;
	}

	private async findUserByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user || !user.password) {
			// Oauth users do not have password
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}
		return user;
	}

	private async updateUser(id: string, updateFields: Partial<PUser>) {
		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateFields as any,
		});
		return updatedUser;
	}

	public async createUser(payload: IUser) {
		const userExists = await this.findUserByEmail(payload.email as string);
		if (userExists) {
			throw new CustomError("User already exists", StatusCodes.CONFLICT);
		}
		const hashedPassword = await hash(payload.password);
		console.log({ ...payload });
		const user = await prisma.user.create({
			data: {
				...(payload as any),
				roleId: DEFAULT_MEMBER_ROLE_ID,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
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
				coleadOf: true,
				leadOf: true,
				memberOf: true,
				joined: true,
				createdAt: true,
				pendingRequest: true,
				projectRatings: true,
			},
		});
		console.log("The created user is ", user);
		const token = await tokenGenerator({ id: user.id }, "1h");
		return { token, user };
	}

	public async login(email: string, password: string) {
		const user = await this.findUserByEmail(email);

		const isValidPassword = await verifyHash(
			user.password as string,
			password
		);
		if (!isValidPassword) {
			throw new CustomError(
				"Invalid login credentials",
				StatusCodes.UNAUTHORIZED
			);
		}

		// Update last_login after successful password verification
		await prisma.user.update({
			where: { id: user.id },
			data: { last_login: new Date() },
		});

		const token = await tokenGenerator(
			{ id: user.id },
			ACCESS_TOKEN_VALIDITY_TIME
		);
		return { token, user };
	}

	public async changePassword(
		id: string,
		payload: {
			oldPassword: string;
			newPassword: string;
		}
	): Promise<Boolean> {
		const { oldPassword, newPassword } = payload;

		const user = await this.findUserById(id);

		const passwordIsValid = await verifyHash(
			user.password as string,
			oldPassword
		);
		if (passwordIsValid) {
			const hashedPassword = await hash(newPassword);
			const updatedUser = await this.updateUser(id, {
				password: hashedPassword,
			});
			return updatedUser && true;
		}
		return false;
	}

	public async forgotPassword(email: string): Promise<Boolean> {
		const user = await this.findUserByEmail(email);
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		const token = await tokenGenerator(
			{
				id: user.id,
				code,
			},
			"10m"
		);
		// const resetLink = `http://localhost:8000/auth/reset-password?token=${token}`;
		console.log(token);
		// Call MAIL service and send RESET code to user's email address
		await mailService.sendResetPasswordEmail(
			user.email,
			user.first_name,
			code
		);
		return token;
	}

	public async resetPassword(payload: {
		token: string;
		otpCode: string;
		newPassword: string;
	}) {
		const { token, otpCode, newPassword } = payload;
		const decodedToken = await verifyToken(token);

		const { id, code } = decodedToken;

		console.log(`Verified token`, id, code);
		if (code === otpCode) {
			const hashedPassword: string = await hash(newPassword);
			const updatedUser = await this.updateUser(id, {
				password: hashedPassword,
			});
			return updatedUser && true;
		}
		throw new CustomError("Incorrect OTP code", StatusCodes.FORBIDDEN);
	}
}

const userService = new UserService();

export default userService;
