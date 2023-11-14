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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../model/db"));
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
//on the every request deserialize function checks user whether in database
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            return done(null, false); // User not found
        }
        // If the user is found, pass the user object to the next middleware
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const userEmail = profile.emails[0];
        console.log(userEmail);
        if (!userEmail) {
            return done(new Error("An email address is required."));
        }
        // Check if user exists, and if it does update user. If not create the user and log the user in.
        let user = yield db_1.default.user.findUnique({
            where: {
                email: userEmail.value,
            },
        });
        if (user) {
            console.log("Logining existing user using github...");
            user = yield db_1.default.user.update({
                where: {
                    email: userEmail.value,
                },
                data: {
                    github_id: profile.id,
                    profile_picture: profile.photos[0].value,
                    last_login: new Date(),
                },
            });
        }
        else {
            console.log("Creating new user using github...");
            user = yield db_1.default.user.create({
                data: {
                    email: userEmail.value,
                    first_name: profile.displayName || profile.username,
                    last_name: "",
                    profile_picture: profile.photos[0].value,
                    github_id: profile.id,
                    last_login: new Date(),
                },
            });
        }
        return done(null, user);
    });
}));
