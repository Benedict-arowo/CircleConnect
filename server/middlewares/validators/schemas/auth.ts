import Joi from "joi";
import { MIN_PASSWORD_LENGTH, SCHOOL_LIST, TRACK_LIST } from "../../../utils";

export const userRegisterSchema = Joi.object({
	first_name: Joi.string().required().messages({
		"string.empty": "First name must not be empty.",
		"any.required": "First name is required.",
	}),
	last_name: Joi.string().required().messages({
		"string.empty": "Last name must not be empty.",
		"any.required": "Last name is required.",
	}),
	email: Joi.string().email().required().messages({
		"string.email": "Please enter a valid email address.",
		"string.empty": "Email must not be empty.",
		"any.required": "Email is required.",
	}),
	password: Joi.string()
		.min(MIN_PASSWORD_LENGTH)
		.required()
		.messages({
			"string.min": `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
			"string.empty": "Password must not be empty.",
			"any.required": "Password is required.",
		}),

	school: Joi.string()
		.valid(...SCHOOL_LIST)
		.required()
		.messages({
			"any.only":
				"School must be one of the following: " +
				SCHOOL_LIST.join(", "),
			"string.empty": "School must not be empty.",
			"any.required": "School is required.",
		}),
	profile_picture: Joi.string().uri().optional().messages({
		"string.uri": "Profile picture must be a valid URL.",
	}),
	track: Joi.string()
		.valid(...TRACK_LIST.engineering, ...TRACK_LIST.product)
		.required()
		.messages({
			"any.only":
				"track must be one of the following: " +
				[...TRACK_LIST.engineering, ...TRACK_LIST.product].join(", "),
			"string.empty": "track must not be empty.",
			"any.required": "track is required.",
		}),
});
// .messages({
// 	"object.unknown": "You have used an invalid field.", // General message for all unknown fields
// });

export const userLoginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.min(MIN_PASSWORD_LENGTH)
		.required()
		.messages({
			"string.min": `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
			"string.empty": "Password must not be empty.",
			"any.required": "Password is required.",
		}),
});

export const changePasswordSchema = Joi.object({
	oldPassword: Joi.string().required().min(6),
	newPassword: Joi.string().required().min(6),
});

export const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
	otpCode: Joi.string().required(),
	newPassword: Joi.string().required().min(6),
});
