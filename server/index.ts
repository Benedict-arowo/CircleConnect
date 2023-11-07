import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import wrapper from "./middlewear/wrapper";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use("", morgan("dev"));

app.get(
	"/",
	wrapper((req: Request, res: Response) => {
		throw new Error("Test");
		res.json({ msg: "Hello World!" });
	})
);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
