"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
const status_codes_1 = require("http-status-codes/build/cjs/status-codes");
const passport = require("passport");
const isLoggedIn = (req, res, next) => {
    // Check if the user is already authenticated via Google or GitHub
    if (req.user) {
        next();
    }
    else {
        // Attempt to authenticate using 'jwt' strategy
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            console.log("jwt authentication attempt");
            if (err) {
                // Handle errors, e.g., invalid token, expired token, etc.
                throw new CustomError_1.default("Authentication failed", status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            if (!user) {
                // If 'jwt' authentication fails, throw an error
                console.log("jwt authentication failed");
                throw new CustomError_1.default("You must be authenticated to access this route.", status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            // If 'jwt' authentication is successful, store the user in req.user
            req.user = user;
            console.log("jwt authentication succeeded");
            next();
        })(req, res, next); // Invoke the middleware function returned by passport.authenticate
    }
};
exports.default = isLoggedIn;
