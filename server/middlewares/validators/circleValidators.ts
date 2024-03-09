import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../CustomError";

const idSchema = Joi.object({
	id: Joi.string().uuid().required(),
});

const circleSchema = Joi.object({
	circle_num: Joi.number().greater(1).required(),
	description: Joi.string().min(60).required(),
});

const validateCreateCircle = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { error } = circleSchema.validate(req.body);

	console.log(req.body.circle_num);

	if (error) {
		const errorMessage = error.details[0].message.replace(/["]/g, "");
		throw new CustomError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);
	}

	next();
};

export { validateCreateCircle };
