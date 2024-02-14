import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import {
	CreateRoleService,
	DeleteRoleService,
	EditRoleService,
} from "../service/roles.service";

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

	const newRole = await CreateRoleService({
		body: { name: roleName, permissions },
	});
	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, data: newRole });
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

	const role = await EditRoleService({
		roleId,
		body: {
			name: roleName,
			permissions,
		},
	});
	return res.status(StatusCodes.OK).json({ success: true, data: role });
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

	await DeleteRoleService(id);
	return res.status(StatusCodes.NO_CONTENT).json({ success: true });
};
