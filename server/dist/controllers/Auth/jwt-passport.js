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
const http_status_codes_1 = require("http-status-codes");
const argon = require("argon2");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const prisma = new client_1.PrismaClient();
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwtToken"];
    }
    return token;
};
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
}, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Checks if the user id provided in the payload matches any existing user's id. And if it does, it logs them in.
    try {
        const { id } = jwt_payload;
        const user = yield prisma.user.findUnique({
            where: { id },
        });
        if (user) {
            return done(null, user);
        }
        else {
            done(new Error(http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
        }
    }
    catch (error) {
        return done(error);
    }
})));
