import Joi from "joi";

export const reviewSchema = Joi.object({
	content: Joi.string().min(10).required(),
});
