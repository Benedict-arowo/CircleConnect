import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../CustomError";

const userRegisterSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required().min(6),
});

const userLoginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required().min(6),
});

const idSchema = Joi.object({
	id: Joi.string().uuid().required(),
});

const reviewContentSchema = Joi.object({
	content: Joi.string().min(10).required(),
});

const validateJWTRegister = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { error } = userRegisterSchema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);
	}

	next();
};

const validateJWTLogin = (req: Request, res: Response, next: NextFunction) => {
	const { error } = userLoginSchema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);
	}

	next();
};

const validateParamsID = (req: Request, res: Response, next: NextFunction) => {
	const { error } = idSchema.validate(req.params);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
	}

	next();
};

const validateReview = (req: Request, res: Response, next: NextFunction) => {
	const { error } = reviewContentSchema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
	}

	next();
};

export {
	validateJWTRegister,
	validateJWTLogin,
	validateParamsID,
	validateReview,
};
