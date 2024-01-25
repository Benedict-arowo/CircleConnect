import express, { Express } from "express";
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
import projectRouter from "./routes/project-route";
import notificationRouter from "./routes/notification-route";
import { Server, Socket } from "socket.io";
import socketMiddleware from "./middlewear/Socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
const http = require("http");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { instrument } = require("@socket.io/admin-ui");

dotenv.config();

const makeApp = (
	database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
	const app: Express = express();
	const server = http.createServer(app);

	const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> =
		new Server(server, {
			cors: {
				origin: "http://localhost:5173",
				credentials: true,
			},
		});

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

	// Socket.io
	instrument(io, {
		auth: false,
		mode: "development",
	});

	app.use(socketMiddleware(io));

	app.use("", morgan("dev"));
	app.use(
		cors({
			origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
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

	const options = {
		definition: {
			openapi: "3.1.0",
			info: {
				title: "CircleConnect API",
				version: "1.0.0",
				description:
					"API for an app, CircleConnect which is a versatile web application designed to empower users to effortlessly create and manage circles or groups, facilitating project sharing, collaboration, and transparency.",
				license: {
					name: "MIT",
					url: "https://spdx.org/licenses/MIT.html",
				},
				contact: {
					name: "Benedict",
					email: "benedict.arowo@gmail.com",
				},
			},
			servers: [
				{
					url: "http://localhost:8000",
				},
			],
		},
		apis: ["./routes/*.ts", , "./routes/Auth/*.ts"],
	};

	const specs = swaggerJsdoc(options);

	io.on("connection", (socket: Socket) => {
		socket.on("disconnect", () => {
			console.log("User disconnected");
		});

		socket.on("joinRoom", (userId: string) => {
			socket.join(`user_${userId}`);
			console.log("User joined", userId);
		});
	});

	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(specs, { explorer: true })
	);
	app.use("/auth/google", googleRouter);
	app.use("/auth/github", githubRouter);

	app.use("/auth/jwt", jwtRouter);
	app.use("/", authRouter);
	app.use("/circle", circleRouter);
	app.use("/project", projectRouter);
	app.use("/notification", notificationRouter);

	app.use(ErrorHandler);

	return { app, server };
};

export default makeApp;
