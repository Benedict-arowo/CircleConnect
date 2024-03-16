import { Application } from "express";
import authRouter from "./Auth/auth-route";
import githubRouter from "./Auth/github-route";
import googleRouter from "./Auth/google-route";
import jwtRouter from "./Auth/jwt-route";
import circleRouter from "./circle-route";
import notificationRouter from "./notification-route";
import projectReviewsRouter from "./project-reviews";
import projectRouter from "./project-route";
import roleRouter from "./roles-route";
import userRouter from "./user-route";

export const applyRoutes = (app: Application) => {
	app.use("/auth/google", googleRouter);
	app.use("/auth/github", githubRouter);
	app.use("/auth/jwt", jwtRouter);

	app.use("/", authRouter);
	app.use("/role", roleRouter);
	app.use("/user", userRouter);
	app.use("/circle", circleRouter);
	app.use("/project", projectRouter);
	app.use("/reviews", projectReviewsRouter);
	app.use("/notification", notificationRouter);
};

// PROPOSED REVISED ROUTES

// export const applyRoutes = (app: Application) => {
// 	app.use("/auth/google", googleRouter);
// 	app.use("/auth/github", githubRouter);

// 	app.use("/auth", jwtRouter);
// 	app.use("/", authRouter);
// 	app.use("/roles", roleRouter);
// 	app.use("/users", userRouter);
// 	app.use("/circles", circleRouter);
// 	app.use("/projects", projectRouter);
// 	app.use("/reviews", projectReviewsRouter);
// 	app.use("/notifications", notificationRouter);
// };
