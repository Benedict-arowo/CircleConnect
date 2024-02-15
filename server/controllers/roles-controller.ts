import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";

type Permission =
	| "canCreateCircle"
	| "canModifyOwnCircle"
	| "canModifyOtherCircle"
	| "canDeleteOwnCircle"
	| "canDeleteOtherCircles"
	| "canLeaveCircle"
	| "canJoinCircle"
	| "canCreateProject"
	| "canModifyOwnProject"
	| "canModifyOtherProject"
	| "canDeleteOwnProject"
	| "canDeleteOtherProject"
	| "canAddProjectToCircle"
	| "canRemoveProjectFromCircle"
	| "isAdmin";

type PermsObj = Record<Permission, boolean>;

export const permissionList = [
	"canCreateCircle",
	"canModifyOwnCircle",
	"canModifyOtherCircle",
	"canDeleteOwnCircle",
	"canDeleteOtherCircles",
	"canLeaveCircle",
	"canJoinCircle",
	"canCreateProject",
	"canModifyOwnProject",
	"canModifyOtherProject",
	"canDeleteOwnProject",
	"canDeleteOtherProject",
	"canAddProjectToCircle",
	"canRemoveProjectFromCircle",
	"isAdmin",
];

const validatePermission = (permsObj: PermsObj) => {
	for (const permission in permsObj) {
		if (!permissionList.includes(permission)) {
			console.log("error");
			return new Error("Not a valid permission");
		}
	}
};

export const createRole = async (req: Req, res: Response) => {
	const {
		user: { role: userRole },
		body: { name: roleName, permissions },
	} = req;

	if (!roleName)
		throw new CustomError(
			"Role name must be provided.",
			StatusCodes.BAD_REQUEST
		);

	// Validates the permissions given by the user
	if (permissions)
		if (validatePermission(permissions) instanceof Error) {
			throw new CustomError(
				"Invalid permissions provided.",
				StatusCodes.BAD_REQUEST
			);
		}

	// Checks if the user has the permission to create a new role.
	if (!(userRole.isAdmin || userRole.canManageRoles))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	try {
		const newRole = await prisma.role.create({
			data: {
				name: roleName,
				...permissions,
			},
		});
		return res
			.status(StatusCodes.CREATED)
			.json({ success: true, data: newRole });
	} catch (error: any) {
		if (error.code === "P2002")
			throw new CustomError(
				"Role with name already exists.",
				StatusCodes.BAD_REQUEST
			);
		else
			throw new CustomError(
				ReasonPhrases.INTERNAL_SERVER_ERROR,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
	}
};

export const getRoles = async (req: Req, res: Response) => {
	const { limit = "10" } = req.query;

	if (isNaN(parseInt(limit)))
		throw new CustomError(
			"Invalid limit provided",
			StatusCodes.BAD_REQUEST
		);

	if (Number(limit) > 25 || Number(limit) < 1)
		throw new CustomError(
			"Invalid limit, must be between 1 and 25",
			StatusCodes.BAD_REQUEST
		);

	const roles = await prisma.role.findMany({
		take: limit ? parseInt(limit) : undefined,
	});

	return res.status(StatusCodes.OK).json({ success: true, data: roles });
};

export const getRole = async (req: Req, res: Response) => {
	const {
		params: { id },
	} = req;

	const role = await prisma.role.findUnique({
		where: { id },
	});

	if (!role) throw new CustomError("Role not found.", StatusCodes.NOT_FOUND);

	return res.status(StatusCodes.OK).json({ success: true, data: role });
};

export const editRole = async (req: Req, res: Response) => {
	const {
		user: { role: userRole },
		body: { name: roleName, permissions },
		params: { id: roleId },
	} = req;

	// Checks if the user has the permission to create a new role.
	if (!(userRole.isAdmin || userRole.canManageRoles))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	// Validates the permissions given by the user
	if (permissions)
		if (validatePermission(permissions) instanceof Error) {
			throw new CustomError(
				"Invalid permissions provided.",
				StatusCodes.BAD_REQUEST
			);
		}

	try {
		const role = await prisma.role.update({
			where: { id: roleId },
			data: {
				name: roleName && roleName,
				...permissions,
			},
		});

		return res.status(StatusCodes.OK).json({ success: true, data: role });
	} catch (error: any) {
		if (error.code === "P2025")
			throw new CustomError("Role not found.", StatusCodes.NOT_FOUND);
		else
			throw new CustomError(
				ReasonPhrases.INTERNAL_SERVER_ERROR,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
	}
};

export const deleteRole = async (req: Req, res: Response) => {
	const {
		user: { role: userRole },
		params: { id },
	} = req;

	// Checks if the user has the permission to create a new role.
	if (!(userRole.isAdmin || userRole.canManageRoles))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	try {
		await prisma.role.delete({
			where: { id },
		});
		return res.status(StatusCodes.NO_CONTENT).json({ success: true });
	} catch (error: any) {
		if (error.code === "P2003") {
			throw new CustomError(
				"To delete this role, you must remove all the users attached to this role.",
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		} else
			throw new CustomError(
				ReasonPhrases.INTERNAL_SERVER_ERROR,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
	}
};
