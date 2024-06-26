import { UserType } from "../types";

export type CircleMemberType = {
	role: "LEAD" | "MEMBER" | "COLEAD" | "PENDING";
	user: UserType;
};

export type CircleRatingType = {
	id: string;
	rating?: number;
	userId: string;
	circleId: string;
};

export type ProjectsType = {
	name: string;
	description: string;
	circle: CircleType;
	createdAt: Date;
	createdBy: CircleMemberType;
	liveLink: string;
	github: string;
	rating: {
		rating: number;
		user: UserType;
		project: ProjectsType;
	}[];
	tags: string[];
	pinned: boolean;
	id: string;
};

export type CircleType = {
	id: number;
	description: string;
	visibility: "PUBLIC" | "PRIVATE";
	averageUserRating: number;
	rating: number;
	members: CircleMemberType[];
	projects: ProjectsType[];
	createdAt: Date;
	_count: {
		member: number;
		projects: number;
		rating: number;
	};
};
