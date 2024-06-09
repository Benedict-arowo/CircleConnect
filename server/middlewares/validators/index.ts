import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../CustomError";

const idSchema = Joi.object({
	id: Joi.string().uuid().required(),
});

const validateBody = (schema: Joi.ObjectSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (schema) {
			const { error } = schema.validate(req.body);

			if (error) {
				const errorMessage = error.details[0].message.replace(
					/["]/g,
					""
				);
				throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
			}
		}
		next();
	};
};

const validateParams = (schema: Joi.ObjectSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (schema) {
			const { error } = schema.validate(req.params);

			if (error) {
				const errorMessage = error.details[0].message.replace(
					/["]/g,
					""
				);
				throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
			}
		}
		next();
	};
};

export { idSchema, validateBody, validateParams };
