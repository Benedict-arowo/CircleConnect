import Joi from "joi";

const circleIdSchema = Joi.object({
	id: Joi.number().greater(0).required(),
});

const circleSchema = Joi.object({
	circle_num: Joi.number().greater(0).required(),
	description: Joi.string().min(60).required(),
});

export { circleSchema, circleIdSchema };
