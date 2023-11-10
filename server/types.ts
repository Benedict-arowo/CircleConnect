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
	user: User;
	logout: Function;
}
