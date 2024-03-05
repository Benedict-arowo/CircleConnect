import { Prisma } from "@prisma/client";
import { Request } from "express";
import { Socket } from "socket.io";

export type User = {
	id: string;
	email?: string;
	username: string;
	first_name: string;
	name: {
		familyName: string;
		givenName: string;
	};
	displayName: string;
	photos: [{ value: string }];
	_json: {
		given_name: string;
		family_name: string;
		picture: string;
	};
	google_id: string;
	github_id: string;
	emails: [{ value: string }];
	role: Prisma.RoleCreateInput;
	// role: {
	// 	id: string;
	// 	name: string;
	// 	canCreateCircle: boolean;
	// 	canModifyOwnCircle: boolean;
	// 	canModifyOtherCircle: boolean;
	// 	canDeleteOwnCircle: boolean;
	// 	canDeleteOtherCircles: boolean;
	// 	canLeaveCircle: boolean;
	// 	canJoinCircle: boolean;
	// 	canCreateProject: boolean;
	// 	canModifyOwnProject: boolean;
	// 	canModifyOtherProject: boolean;
	// 	canDeleteOwnProject: boolean;
	// 	canDeleteOtherProject: boolean;
	// 	canAddProjectToCircle: boolean;
	// 	canRemoveProjectFromCircle: boolean;
	// 	canManageRoles: boolean;
	// 	canManageUsers: boolean;
	// 	canCreateProjectReviews: boolean;
	// 	canModifyOwnProjectReviews: boolean;
	// 	canDeleteOwnProjectReviews: boolean;
	// 	canManageProjectReviews: boolean;
	// 	isAdmin: boolean;
	// };
};

export interface Req extends Request {
	io: Socket;
	query: {
		circle_num?: string;
		id?: string;
		circle_id?: string;
		sortedBy?: string;
		limit?: string;
		circleId?: string;
		pinned?: string;
		userId?: string;
		status?: string;
		first_name?: string;
		last_name?: string;
		roleId?: string;
	};
	body: {
		description?: string;
		circle_num?: number;
		email?: string;
		pictures?: string[];
		password?: string;
		first_name?: string;
		last_name?: string;
		rating?: number;
		circleId?: string;
		body?: string;
		name?: string;
		pinned?: boolean;
		github?: string;
		liveLink?: string;
		tags?: string[];
		roleId?: string;
		school?: string;
		profile_picture?: string;
		track?: string;
		visibility?: "PUBLIC" | "PRIVATE";
		permissions?: {
			canCreateCircle: boolean;
			canModifyOwnCircle: boolean;
			canModifyOtherCircle: boolean;
			canDeleteOwnCircle: boolean;
			canDeleteOtherCircles: boolean;
			canLeaveCircle: boolean;
			canJoinCircle: boolean;
			canCreateProject: boolean;
			canModifyOwnProject: boolean;
			canModifyOtherProject: boolean;
			canDeleteOwnProject: boolean;
			canDeleteOtherProject: boolean;
			canAddProjectToCircle: boolean;
			canRemoveProjectFromCircle: boolean;
			canCreateProjectReviews: boolean;
			canModifyOwnProjectReviews: boolean;
			canManageProjectRevies: boolean;
			canDeleteOwnProjectReviews: boolean;
			isAdmin: boolean;
		};
		request?: {
			type: "ACCEPT" | "DECLINE";
			userId: string;
		};
		removeUser?: {
			userId: string;
		};
		manageUser?: {
			action: "PROMOTE" | "DEMOTE";
			userId: string;
		};
		content?: string;
	};
	user: User;
	logout: Function;
}
