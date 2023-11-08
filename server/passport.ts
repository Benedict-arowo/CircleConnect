import { PrismaClient, Prisma } from "@prisma/client";
import CustomError from "./middlewear/CustomError";
import { User } from "./types";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const prisma = new PrismaClient();

passport.serializeUser(function (user: User, done: Function) {
	done(null, user.google_id);
});

//on the every request deserialize function checks user whether in database
passport.deserializeUser(async (id: string, done: Function) => {
	try {
		console.log(id);
		const user = await prisma.user.findUnique({
			where: { google_id: id },
		});

		if (!user) {
			return done(null, false); // User not found
		}

		// If the user is found, pass the user object to the next middleware
		done(null, user);
	} catch (error: any) {
		console.log("here");
		done(error);
	}
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:8000/auth/google/callback",
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: User,
			done: Function
		) => {
			// This is where you handle the authenticated user, e.g., store them in your database.
			// You can customize this part as per your application's requirements.
			const google_id = profile.id; // Unique Google ID
			const email = profile.emails[0].value; // User's email

			// Check if the user exists
			// prisma.user.findFirst({
			// 	where: {
			// 		OR: [
			// 			{
			// 				google_id,
			// 			},
			// 			{
			// 				email,
			// 			},
			// 		],
			// 	},
			// });

			const existingUser = await prisma.user.findUnique({
				where: {
					OR: [
						{
							google_id,
						},
						{
							email,
						},
					],
				},
			});

			if (existingUser) {
				// User already exists, log them in
				return done(null, existingUser);
			}

			// User doesn't exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					google_id: google_id,
					email,
					first_name: profile.name.givenName,
					last_name: profile.name.familyName,
					joined: new Date(),
					last_login: new Date(),
				},
			});

			// Log in the new user
			return done(null, newUser);
		}
	)
);

// (async () => {
// 	await prisma.user.upsert({
// 		create: {
// 			id: User.id.toString(),
// 			first_name: User.name.givenName,
// 			last_name: User.name.familyName,
// 			email: User.emails[0].value,
// 			joined: new Date(),
// 			last_login: new Date(),
// 		},
// 		update: {
// 			last_login: new Date(),
// 		},
// 		where: {
// 			id: User.id.toString(),
// 		},
// 	});
// })(),
