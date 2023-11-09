import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import wrapper from "./middlewear/wrapper";
import ErrorHandler from "./middlewear/ErrorHandler";
import CustomError from "./middlewear/CustomError";
import authRouter from "./routes/Auth/auth-route";
import { Req } from "./types";
import isLoggedIn from "./middlewear/isLoggedIn";
import googleRouter from "./routes/Auth/google-route";
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { PrismaClient } = require("@prisma/client");

require("./controllers/Auth/google-passport");

dotenv.config();
const app: Express = express();
const prisma = new PrismaClient();

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		store: new pgSession({
			prisma, // Prisma client instance
			tableName: process.env.SESSION_TABLE_NAME, // Name of the session table in database
		}),
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT;

app.use("/auth/google", googleRouter);

app.use("/", authRouter);

app.get(
	"/",
	isLoggedIn,
	wrapper((req: Req, res: Response) => {
		res.json({ msg: "Hello World!", user: req.user });
	})
);

app.use(ErrorHandler);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
