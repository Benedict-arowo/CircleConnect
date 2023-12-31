import { Request } from "express";

export type User = {
	id: string;
	email?: string;
	username: string;
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
};

export interface Req extends Request {
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
		techUsed?: string[];
		visibility?: "PUBLIC" | "PRIVATE";
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
	};
	user: User;
	logout: Function;
}
