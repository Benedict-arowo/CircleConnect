const argon = require("argon2");
const jwt = require("jsonwebtoken");

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
