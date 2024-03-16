import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewares/CustomError";
import prisma from "../model/db";

export type Permission =
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

export type PermsObj = Record<Permission, boolean>;
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
	"canManageRoles",
	"canManageUsers",
];

export const validatePermission = (permsObj: PermsObj) => {
	for (const permission in permsObj) {
		if (!permissionList.includes(permission)) {
			console.log(permission);
			return new Error("Not a valid permission");
		}
	}
};

type RoleServiceArgs = {
	roleId?: string;
	body: {
		name?: string;
		permissions?: PermsObj;
	};
};

export const CreateRoleService = async ({ body }: RoleServiceArgs) => {
	const { name: roleName, permissions } = body;

	if (!roleName)
		throw new CustomError(
			"Role name must be provided.",
			StatusCodes.BAD_REQUEST
		);

	try {
		const newRole = await prisma.role.create({
			data: {
				name: roleName,
				...permissions,
			},
		});
		return newRole;
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

export const EditRoleService = async ({ roleId, body }: RoleServiceArgs) => {
	const { name: roleName, permissions } = body;

	try {
		const role = await prisma.role.update({
			where: { id: roleId },
			data: {
				name: roleName && roleName,
				...permissions,
			},
		});

		return role;
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

export const DeleteRoleService = async (id: string) => {
	try {
		await prisma.role.delete({
			where: { id },
		});
		return 0;
	} catch (error: any) {
		if (error.code === "P2003") {
			throw new CustomError(
				"To delete this role, you must remove all the users attached to this role.",
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		} else if (error.code === "P2025")
			throw new CustomError("Role not found.", StatusCodes.NOT_FOUND);
		else
			throw new CustomError(
				ReasonPhrases.INTERNAL_SERVER_ERROR,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
	}
};
