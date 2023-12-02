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
	circles: CircleType[];
	projects: string;
	ratings: string;
};
