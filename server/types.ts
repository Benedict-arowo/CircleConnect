import { Request } from "express";

export type User = {
	id: string;
	name: {
		familyName: string;
		givenName: string;
	};
	google_id: string;
	emails: [{ value: string }];
};

export interface Req extends Request {
	user: {
		id: string;
		name: {
			familyName: string;
			givenName: string;
		};
		emails: [{ value: string }];
	};
	logout: Function;
}
