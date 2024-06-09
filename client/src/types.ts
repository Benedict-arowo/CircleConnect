import { ProjectsType } from "./Components/types";

export type Alert = {
	status: null | "success" | "error";
	description: string | null;
};

export type CircleType = {
	num: number;
};

export type UserType = {
	email: string;
	id: string;
	profile_picture: string;
	first_name: string;
	last_name: string;
	circle: {
		role: "LEADER" | "COLEADER" | "MEMBER" | "PENDING";
		circle: {
			id: string;
			description: string;
		};
	};
	projects: ProjectsType[];
	ratings: string;
	track: string;
	school: string;
	leadOf: UserType;
	memberOf: UserType;
	coleadOf: UserType;
	role: {
		id: string;
		name: string;
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
		canAddUserToProject: boolean;
		canManageRoles: boolean;
		canManageUsers: boolean;
		canCreateProjectReviews: boolean;
		canModifyOwnProjectReviews: boolean;
		canDeleteOwnProjectReviews: boolean;
		canManageProjectReviews: boolean;
		isAdmin: boolean;
	};
};

export type UserTypeClean = {
	email: string;
	id: string;
	profile_picture: string;
	first_name: string;
	last_name: string;
};

export type pinProject = {
	id: string;
	status: boolean;
};

export type NotificationType = {
	id: string;
	content: string;
	is_read: boolean;
	url: string;
	user: UserTypeClean;
	createdAt: Date;
};
