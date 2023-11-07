import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import wrapper from "./middlewear/wrapper";
import ErrorHandler from "./middlewear/ErrorHandler";
import CustomError from "./middlewear/CustomError";
import authRouter from "./routes/auth-route";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use("", morgan("dev"));
app.use("/", authRouter);
app.get(
	"/",
	wrapper((req: Request, res: Response) => {
		throw new Error("Test");
		res.json({ msg: "Hello World!" });
	})
);

app.use(ErrorHandler);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
