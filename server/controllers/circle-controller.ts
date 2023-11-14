import { Response } from "express";
import { Req } from "../types";

export const getCircles = (req: Req, res: Response) => {
	res.json({ page: "getCircles" });
};

export const getCircle = (req: Req, res: Response) => {
	res.json({ page: "getCircle" });
};

export const createCircle = (req: Req, res: Response) => {
	res.json({ page: "createCircle" });
};

export const editCircle = (req: Req, res: Response) => {
	res.json({ page: "editCircle" });
};

export const deleteCircle = (req: Req, res: Response) => {
	res.json({ page: "deleteCircle" });
};
