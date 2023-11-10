import { PrismaClient, Prisma } from "@prisma/client";
import CustomError from "../../middlewear/CustomError";
import { User } from "../../types";
import { ReasonPhrases } from "http-status-codes";
const argon = require("argon2");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const prisma = new PrismaClient();

interface Req extends Request {
	cookies: Record<string, string>;
}

const cookieExtractor = (req: Req) => {
	console.log(1);
	let token = null;
	if (req && req.cookies) {
		console.log(req.cookies);
		token = req.cookies["jwtToken"];
	}
	return token;
};

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_SECRET,
		},
		async (jwt_payload: User, done: Function) => {
			console.log(jwt_payload);
			try {
				const { id } = jwt_payload;

				const user = await prisma.user.findUnique({
					where: { id: parseInt(id) },
				});

				if (user) {
					return done(null, user);
				} else {
					done(new Error(ReasonPhrases.UNAUTHORIZED));
				}
			} catch (error) {
				return done(error);
			}
		}
	)
);
