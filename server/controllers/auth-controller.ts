import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "../service/auth.service";
import CustomError from "../middlewares/CustomError";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../utils";

export const registerUser = async (req: Request, res: Response) => {
	const user = await userService.createUser(req.body as any);
	return res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Successfully registered user.",
		data: {
			...user,
		},
	});
};

export const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const { token, user } = await userService.login(
		email as string,
		password as string
	);
	return res
		.cookie("jwtToken", token, {
			maxAge: JWT_ACCESS_TOKEN_EXPIRY,
			httpOnly: true,
			secure: false,
			path: "/",
			sameSite: "strict",
		})
		.status(StatusCodes.OK)
		.json({
			success: true,
			message: "Successfully logged in.",
			data: {
				...user,
				token,
			},
		});
};

export const changePassword = async (req: Request, res: Response) => {
	const success = await userService.changePassword(
		(req as any).user.id,
		req.body
	);
	if (!success) {
		throw new CustomError(
			"Password is incorrect",
			StatusCodes.UNAUTHORIZED
		);
	}
	res.status(200).json({
		success: true,
		message: "Password changed successfully",
	});
};

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;
	const token = await userService.forgotPassword(email as string);
	return res
		.cookie("_rstpwd", token, {
			maxAge: JWT_ACCESS_TOKEN_EXPIRY,
			httpOnly: true,
			secure: false,
			path: "/",
			sameSite: "strict",
		})
		.status(StatusCodes.OK)
		.json({
			success: true,
			message: "Password reset code sent successfully",
		});
};

export const resendOTP = async (req: Request, res: Response) => {
	const { email } = req.body;
	const token = await userService.forgotPassword(email as string);
	return res
		.cookie("_rstpwd", token, {
			maxAge: JWT_ACCESS_TOKEN_EXPIRY,
			httpOnly: true,
			secure: false,
			path: "/",
			sameSite: "strict",
		})
		.status(StatusCodes.OK)
		.json({
			success: true,
			message: "Password reset code sent successfully",
		});
};

export const resetPassword = async (req: Request, res: Response) => {
	const token = req.cookies._rstpwd;
	if (!token) {
		throw new CustomError(
			"Invalid or Expired OTP code",
			StatusCodes.UNAUTHORIZED
		);
	}

	const success = await userService.resetPassword(token, req.body as any);
	if (success) {
		res.clearCookie("_rstpwd");
		res.status(200).json({
			success: true,
			message: "Password reset completed successfully",
		});
	}
	throw new CustomError("Incorrect OTP code", StatusCodes.UNAUTHORIZED);
};
