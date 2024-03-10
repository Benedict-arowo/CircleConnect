import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../CustomError";

const circleIdSchema = Joi.object({
	id: Joi.number().greater(0).required(),
});

const circleSchema = Joi.object({
	circle_num: Joi.number().greater(0).required(),
	description: Joi.string().min(60).required(),
});

const validateCircleId = (req: Request, res: Response, next: NextFunction) => {
	const { error } = circleIdSchema.validate(req.params);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);
	}

	next();
};

const validateCreateCircle = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { error } = circleSchema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);
	}

	next();
};

export { validateCreateCircle, validateCircleId };
