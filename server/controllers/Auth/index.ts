import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "../../service/user.service";
import { Req } from "../../types";
import CustomError from "../../middlewares/CustomError";

export const registerUser = async (req: Req, res: Response) => {
	const { token, user } = await userService.createUser(req.body as any);
	return res
		.cookie("jwtToken", token, { httpOnly: true })
		.status(StatusCodes.CREATED)
		.json({
			success: true,
			message: "Successfully registered user.",
			data: {
				...user,
				password: null,
				token: token,
			},
		});
};

export const loginUser = async (req: Req, res: Response) => {
	const { email, password } = req.body;
	const { token, user } = await userService.login(
		email as string,
		password as string
	);
	return res
		.cookie("jwtToken", token, { httpOnly: true })
		.status(StatusCodes.OK)
		.json({
			success: true,
			message: "Successfully logged in.",
			data: {
				...user,
				password: null,
			},
		});
};

export const changePassword = async (req: Req, res: Response) => {
	const success = await userService.changePassword(req.user.id, req.body);
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

export const forgotPassword = async (req: Req, res: Response) => {
	const { email } = req.body;
	await userService.forgotPassword(email as string);
	res.status(200).json({
		success: true,
		message: "Password reset link sent successfully",
	});
};

export const resetPassword = async (req: Req, res: Response) => {
	const success = await userService.resetPassword(req.body as any);
	if (success) {
		throw new CustomError(
			"Password is incorrect",
			StatusCodes.UNAUTHORIZED
		);
	}
	res.status(200).json({
		success: true,
		message: "Password reset completed successfully",
	});
};
