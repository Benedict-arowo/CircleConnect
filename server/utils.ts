import CustomError from "./middlewares/CustomError";
import { User } from "./types";

const argon = require("argon2");
const jwt = require("jsonwebtoken");

export const PrismaNotFoundErrorCode = "P2025";
export const verifyHash = async (
	hashedValue: string,
	unhashedValue: string
) => {
	return await argon.verify(hashedValue, unhashedValue);
};

export const tokenGenerator = async (
	payload: any,
	expiresIn: string | number
) => {
	return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyToken = async (token: string) => {
	try {
		return await jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		throw new CustomError("Invalid or expired token", 403);
	}
};

export const hash = async (value: any) => {
	const hashedValue = await argon.hash(value);
	return hashedValue;
};

export const UserSelectMinimized = {
	email: true,
	id: true,
	profile_picture: true,
	first_name: true,
	last_name: true,
	projects: {
		select: {
			id: true,
			circleId: true,
			name: true,
			tags: true,
		},
	},
	role: {
		select: {
			id: true,
			name: true,
		},
	},
	track: true,
	school: true,
	joined: true,
	createdAt: true,
};

export const UserSelectClean = {
	email: true,
	id: true,
	profile_picture: true,
	first_name: true,
	last_name: true,
	role: true,
};

export const UserSelectFull = {
	email: true,
	id: true,
	profile_picture: true,
	first_name: true,
	projects: true,
	leadOf: true,
	coleadOf: true,
	memberOf: true,
	role: true,
};

export const minimumCircleDescriptionLength = 60;
export const MAX_RATING_VALUE = 5;
export const SCHOOL_LIST = ["ENGINEERING"];
export const TRACK_LIST = {
	engineering: ["FRONTEND", "BACKEND", "CLOUD"],
	product: [],
};
export type TrackType = "CLOUD" | "FRONTEND" | "BACKEND";
export const ACCESS_TOKEN_VALIDITY_TIME = "1h";

export const DEFAULT_ADMIN_USER_EMAIL = "admin@circleconnect.com";
export const DEFAULT_USER_EMAIL = "member@circleconnect.com";
export const DEFAULT_MEMBER_ROLE_ID = "c53fc77e-cb8b-4c05-ae3f-3cdb0bd7fc60";
export const DEFAULT_ADMIN_ROLE_ID = "9fadb132-f4c5-478e-8b35-bdff9c2342d6";
export const ADMIN_USER_PASSWORD = "adminuser";
export const DEFAULT_USER_PASSWORD = "user1234";
export const MIN_PASSWORD_LENGTH = 8;
export const JWT_ACCESS_TOKEN_EXPIRY = 600000; //in milliseconds (10 minutes)
