import CustomError from "../../middlewear/CustomError";
import prisma from "../../model/db";
import { User } from "../../types";
import { DEFAULT_MEMBER_ROLE_ID } from "../../utils";
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;

passport.serializeUser(function (user: User, done: Function) {
	done(null, user.id);
});

//on the every request deserialize function checks user whether in database
passport.deserializeUser(async (id: string, done: Function) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			include: {
				role: true,
				circle: true,
			},
		});
		if (!user) {
			return done(null, false); // User not found
		}
		// If the user is found, pass the user object to the next middleware
		done(null, user);
	} catch (error: any) {
		console.log(error);
		done(error);
	}
});

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
		},

		async function (
			accessToken: string,
			refreshToken: string,
			profile: User,
			done: Function
		) {
			const userEmail = profile.emails[0];
			console.log(userEmail);
			if (!userEmail) {
				return done(new Error("An email address is required."));
			}
			// Check if user exists, and if it does update user. If not create the user and log the user in.

			let user = await prisma.user.findUnique({
				where: {
					email: userEmail.value,
				},
			});

			if (user) {
				console.log("Logining existing user using github...");
				user = await prisma.user.update({
					where: {
						email: userEmail.value,
					},
					data: {
						github_id: profile.id,
						profile_picture: profile.photos[0].value,
						last_login: new Date(),
					},
				});
			} else {
				console.log("Creating new user using github...");
				user = await prisma.user.create({
					data: {
						email: userEmail.value,
						first_name: profile.displayName || profile.username,
						last_name: "",
						profile_picture: profile.photos[0].value,
						github_id: profile.id,
						roleId: DEFAULT_MEMBER_ROLE_ID,
						last_login: new Date(),
					},
				});
			}
			return done(null, user);
		}
	)
);
