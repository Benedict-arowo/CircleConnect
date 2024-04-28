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
	circles: CircleType[];
	projects: ProjectsType[];
	ratings: string;
	track: string;
	school: string;
	leadOf: UserType;
	memberOf: UserType;
	coleadOf: UserType;
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
