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

export const hash = async (value: any) => {
	const hashedValue = await argon.hash(value);
	return hashedValue;
};

export const UserSelectMinimized = {
	email: true,
	id: true,
	profile_picture: true,
	first_name: true,
	projects: true,
};

export const UserSelectClean = {
	email: true,
	id: true,
	profile_picture: true,
	first_name: true,
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
};

export const minimumCircleDescriptionLength = 80;
export const MAX_RATING_VALUE = 5;
