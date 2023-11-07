import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import ErrorHandler from "./middlewear/ErrorHandler";
import CustomError from "./middlewear/CustomError";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use("", morgan("dev"));

app.get("/", (req: Request, res: Response) => {
	res.json({ msg: "Hello World!" });
});

app.use(ErrorHandler);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
