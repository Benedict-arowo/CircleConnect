import { StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";

export const createRole = async (req: Req, res: Response) => {
	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: "create role" });
};

export const getRoles = async (req: Req, res: Response) => {
	const roles = await prisma.role.findMany({
		take: 10,
	});

	return res.status(StatusCodes.OK).json({ success: true, data: roles });
};

export const getRole = async (req: Req, res: Response) => {
	return res.status(StatusCodes.OK).json({ success: true, data: "role" });
};

export const editRole = async (req: Req, res: Response) => {
	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: "edit role" });
};

export const deleteRole = async (req: Req, res: Response) => {
	return res.status(StatusCodes.OK).json({ success: true });
};
