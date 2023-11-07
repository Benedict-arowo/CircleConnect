import { Request, Response } from "express";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const router = express.Router();

router.route("/test").get(
	wrapper((req: Request, res: Response) => {
		return res.json({ hello: "hi" });
	})
);

export default router;
