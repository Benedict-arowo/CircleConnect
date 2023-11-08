"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = new client_1.PrismaClient();
passport.serializeUser(function (user, done) {
    done(null, user.google_id);
});
//on the every request deserialize function checks user whether in database
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(id);
        const user = yield prisma.user.findUnique({
            where: { google_id: id },
        });
        if (!user) {
            return done(null, false); // User not found
        }
        // If the user is found, pass the user object to the next middleware
        done(null, user);
    }
    catch (error) {
        console.log("here");
        done(error);
    }
}));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
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
    const existingUser = yield prisma.user.findUnique({
        where: {
            google_id,
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
        console.log("Logging in an existing user.");
        const user = yield prisma.user.update({
            where: { google_id },
            data: {
                profile_picture: profile._json.picture,
                last_login: new Date(),
            },
        });
        return done(null, user);
    }
    // User doesn't exist, create a new user
    console.log("Creating a new user.");
    const newUser = yield prisma.user.create({
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
})));
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
