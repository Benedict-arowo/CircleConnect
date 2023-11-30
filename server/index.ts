import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import ErrorHandler from "./middlewear/ErrorHandler";
import authRouter from "./routes/Auth/auth-route";
import googleRouter from "./routes/Auth/google-route";
import githubRouter from "./routes/Auth/github-route";
import jwtRouter from "./routes/Auth/jwt-route";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import dotenv from "dotenv";
import circleRouter from "./routes/circle-route";
import ratingRouter from "./routes/rarting-route";
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

dotenv.config();

const makeApp = (
	database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
	const app: Express = express();
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false, // don't save session if unmodified
			saveUninitialized: false, // don't create session until something stored
			store: new pgSession({
				prisma: database, // Prisma client instance
				tableName: process.env.SESSION_TABLE_NAME as string, // Name of the session table in database
			}),
		})
	);

	app.use("", morgan("dev"));
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		})
	);
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	require("./controllers/Auth/google-passport");
	require("./controllers/Auth/github-passport");
	require("./controllers/Auth/jwt-passport");

	// Initialize Passport
	app.use(passport.initialize());
	app.use(passport.session());

	app.use("/auth/google", googleRouter);
	app.use("/auth/github", githubRouter);
	app.use("/auth/jwt", jwtRouter);

	app.use("/", authRouter);
	app.use("/circle", circleRouter);
	app.use("/rating", ratingRouter);

	app.use(ErrorHandler);
	return app;
};

export default makeApp;
