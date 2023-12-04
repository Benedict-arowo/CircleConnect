export type CircleMemberType = {
	role: "LEAD" | "MEMBER" | "COLEAD";
	email: string;
	id: string;
	profile_picture: string;
	first_name: string;
};

export type CircleRatingType = {
	id: string;
	rating: number;
	userId: string;
	circleId: string;
};

export type CircleType = {
	id: number;
	description: string;
	lead: CircleMemberType;
	colead: CircleMemberType;
	visibility: "PUBLIC" | "PRIVATE";
	averageUserRating: number;
	rating: CircleRatingType[];
	members: CircleMemberType[];
	requests: CircleMemberType[];
	projects: [];
	createdAt: Date;
	_count: {
		member: number;
		projects: number;
		rating: number;
	};
};
