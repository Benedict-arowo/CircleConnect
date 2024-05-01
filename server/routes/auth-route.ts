import express from "express";
import rateLimit from "express-rate-limit";
import {
	changePassword,
	forgotPassword,
	loginUser,
	registerUser,
	resetPassword,
} from "../controllers/auth-controller";
import { validateBody } from "../middlewares/validators";
import {
	changePasswordSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	userLoginSchema,
	userRegisterSchema,
} from "../middlewares/validators/schemas/auth";
import wrapper from "../middlewares/wrapper";
import isLoggedIn from "../middlewares/isLoggedIn";

const authRouter = express.Router();

// Set limiter on the reset password endpoint - max 2 requests in 10 minutes
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 2,
	standardHeaders: true,
	legacyHeaders: false,
});

authRouter.post("/login", validateBody(userLoginSchema), wrapper(loginUser));

authRouter.post(
	"/register",
	validateBody(userRegisterSchema),
	wrapper(registerUser)
);

authRouter.post(
	"/change-password",
	isLoggedIn,
	limiter,
	validateBody(changePasswordSchema),
	wrapper(changePassword)
);

authRouter.post(
	"/forgot-password",
	limiter,
	validateBody(forgotPasswordSchema),
	wrapper(forgotPassword)
);
authRouter.post(
	"/reset-password",
	limiter,
	validateBody(resetPasswordSchema),
	wrapper(resetPassword)
);

export default authRouter;
