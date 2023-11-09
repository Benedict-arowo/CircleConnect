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
const GithubStrategy = require("passport-github2").Strategy;
const prisma = new client_1.PrismaClient();
passport.serializeUser(function (user, done) {
    console.log(`User-github-serial`, user);
    done(null, user.id);
});
//on the every request deserialize function checks user whether in database
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Id-github-de ${id}`);
    try {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(id) },
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
        let user = yield prisma.user.findUnique({
            where: {
                email: userEmail.value,
            },
        });
        if (user) {
            console.log("Logining existing user using github...");
            user = yield prisma.user.update({
                where: {
                    email: userEmail.value,
                },
                data: {
                    github_id: profile.id,
                },
            });
        }
        else {
            console.log("Creating new user using github...");
            user = yield prisma.user.create({
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
        console.log(`User`, user);
        return done(null, user);
    });
}));
// 1] {
// [1]   id: '59146074',
// [1]   nodeId: 'MDQ6VXNlcjU5MTQ2MDc0',
// [1]   displayName: null,
// [1]   username: 'SnowyGamerYT',
// [1]   profileUrl: 'https://github.com/SnowyGamerYT',
// [1]   emails: [ { value: 'oritsegbe2001@gmail.com' } ],
// [1]   photos: [ { value: 'https://avatars.githubusercontent.com/u/59146074?v=4' } ],
// [1]   provider: 'github',
// [1]   _raw: '{"login":"SnowyGamerYT","id":59146074,"node_id":"MDQ6VXNlcjU5MTQ2MDc0","avatar_url":"https://avatars.githubusercontent.com/u/59146074?v=4","gravatar_id":"","url":"https://api.github.com/users/SnowyGamerYT","html_url":"https://github.com/SnowyGamerYT","followers_url":"https://api.github.com/users/SnowyGamerYT/followers","following_url":"https://api.github.com/users/SnowyGamerYT/following{/other_user}","gists_url":"https://api.github.com/users/SnowyGamerYT/gists{/gist_id}","starred_url":"https://api.github.com/users/SnowyGamerYT/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/SnowyGamerYT/subscriptions","organizations_url":"https://api.github.com/users/SnowyGamerYT/orgs","repos_url":"https://api.github.com/users/SnowyGamerYT/repos","events_url":"https://api.github.com/users/SnowyGamerYT/events{/privacy}","received_events_url":"https://api.github.com/users/SnowyGamerYT/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":"oritsegbe2001@gmail.com","hireable":null,"bio":null,"twitter_username":null,"public_repos":1,"public_gists":0,"followers":0,"following":0,"created_at":"2019-12-22T17:56:14Z","updated_at":"2023-11-08T18:27:40Z"}',
// [1]   _json: {
// [1]     login: 'SnowyGamerYT',
// [1]     id: 59146074,
// [1]     node_id: 'MDQ6VXNlcjU5MTQ2MDc0',
// [1]     avatar_url: 'https://avatars.githubusercontent.com/u/59146074?v=4',
// [1]     gravatar_id: '',
// [1]     url: 'https://api.github.com/users/SnowyGamerYT',
// [1]     html_url: 'https://github.com/SnowyGamerYT',
// [1]     followers_url: 'https://api.github.com/users/SnowyGamerYT/followers',
// [1]     following_url: 'https://api.github.com/users/SnowyGamerYT/following{/other_user}',
// [1]     gists_url: 'https://api.github.com/users/SnowyGamerYT/gists{/gist_id}',
// [1]     starred_url: 'https://api.github.com/users/SnowyGamerYT/starred{/owner}{/repo}',
// [1]     subscriptions_url: 'https://api.github.com/users/SnowyGamerYT/subscriptions',
// [1]     organizations_url: 'https://api.github.com/users/SnowyGamerYT/orgs',
// [1]     repos_url: 'https://api.github.com/users/SnowyGamerYT/repos',
// [1]     events_url: 'https://api.github.com/users/SnowyGamerYT/events{/privacy}',
// [1]     received_events_url: 'https://api.github.com/users/SnowyGamerYT/received_events',
// [1]     type: 'User',
// [1]     site_admin: false,
// [1]     name: null,
// [1]     company: null,
// [1]     blog: '',
// [1]     location: null,
// [1]     email: 'oritsegbe2001@gmail.com',
// [1]     hireable: null,
// [1]     bio: null,
// [1]     twitter_username: null,
// [1]     public_repos: 1,
// [1]     public_gists: 0,
// [1]     followers: 0,
// [1]     following: 0,
// [1]     created_at: '2019-12-22T17:56:14Z',
// [1]     updated_at: '2023-11-08T18:27:40Z'
// [1]   }
// [1] }
