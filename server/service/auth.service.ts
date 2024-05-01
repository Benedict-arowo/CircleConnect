import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewares/CustomError";
import prisma from "../model/db";
import {
	ACCESS_TOKEN_VALIDITY_TIME,
	DEFAULT_MEMBER_ROLE_ID,
	hash,
	tokenGenerator,
	verifyHash,
	verifyToken,
} from "../utils";
import { School, Track } from "@prisma/client";
import mailService from "./messaging.service";

interface IUser {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	password?: string;
	roleId?: string;
	school?: string;
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

	private async findUserByEmail(email: string, includeRole = false) {
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				role: includeRole,
			},
		});
		if (!user || !user.password) {
			// Oauth users do not have password
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}
		return user;
	}

	public async createUser(payload: IUser) {
		const {
			first_name,
			last_name,
			email,
			password,
			roleId,
			school,
			profile_picture,
			track,
		} = payload;

		const userExists = await await prisma.user.findUnique({
			where: { email },
		});
		if (userExists) {
			throw new CustomError("User already exists", StatusCodes.CONFLICT);
		}
		const hashedPassword = await hash(password);

		try {
			const newUser = await prisma.user.create({
				data: {
					first_name,
					last_name,
					email,
					password: hashedPassword,
					profile_picture,
					roleId: roleId ? roleId : DEFAULT_MEMBER_ROLE_ID,
					school: school?.toUpperCase() as School,
					track: track.toUpperCase() as Track,
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
	}

	public async login(email: string, password: string) {
		const user = await this.findUserByEmail(email, true);

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

		// Return user data excluding the password
		const { password: _, ...userWithoutPassword } = user;

		return { token, user: userWithoutPassword };
	}

	private async updateUser(id: string, updateFields: Partial<IUser>) {
		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateFields as any,
		});
		return updatedUser;
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

		const isPasswordValid = await verifyHash(
			user.password as string,
			oldPassword
		);

		if (isPasswordValid) {
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
		console.log(token, code);
		// Call MAIL service and send RESET code to user's email address
		await mailService.sendResetPasswordEmail(
			user.email,
			user.first_name,
			code
		);
		return token;
	}

	public async resetPassword(
		token: string,
		body: {
			otpCode: string;
			newPassword: string;
		}
	) {
		const { otpCode, newPassword } = body;

		const decodedToken = await verifyToken(token);
		const { id, code } = decodedToken;

		if (code === otpCode) {
			const hashedPassword: string = await hash(newPassword);
			const updatedUser = await this.updateUser(id, {
				password: hashedPassword,
			});
			return updatedUser && true;
		}
		return false;
	}
}

const userService = new UserService();

export default userService;
