import { PrismaClient, Prisma } from "@prisma/client";
import CustomError from "../../middlewear/CustomError";
import { User } from "../../types";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const prisma = new PrismaClient();

passport.serializeUser(function (user: User, done: Function) {
	console.log(`User-google ${user}`);
	done(null, user.id);
});

//on the every request deserialize function checks user whether in database
passport.deserializeUser(async (id: string, done: Function) => {
	console.log(`Id-google ${id}`);
	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
		});

		if (!user) {
			return done(null, false); // User not found
		}

		// If the user is found, pass the user object to the next middleware
		done(null, user);
	} catch (error: any) {
		done(error);
	}
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
			const existingUser = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});

			if (existingUser) {
				console.log("Logging in an existing user using google.");
				const user = await prisma.user.update({
					where: { email },
					data: {
						profile_picture: profile._json.picture,
						last_login: new Date(),
					},
				});

				return done(null, user);
			}

			// User doesn't exist, create a new user
			console.log("Creating a new user using google.");
			const newUser = await prisma.user.create({
				data: {
					google_id: google_id,
					email,
					first_name: profile._json.given_name,
					last_name: profile._json.family_name,
					profile_picture: profile._json.picture,
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