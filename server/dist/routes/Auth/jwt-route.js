"use strict";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const jwt_controller_1 = require("../../controllers/Auth/jwt-controller");
const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");
jwtRouter.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({ status: "success", user: req.user });
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in with email and password to obtain JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns the user data and a JWT token in the cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the login was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully logged in."
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request. Indicates missing email or password, or invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingEmailOrPassword:
 *                 value:
 *                   status: false
 *                   message: "Email, and password must be provided."
 *               invalidPassword:
 *                 value:
 *                   status: false
 *                   message: "Invalid password provided."
 *               invalidSignInMethod:
 *                 value:
 *                   status: false
 *                   message: "Try using google or github to sign into this account."
 *       404:
 *         description: Bad Request. Indicates user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingEmailOrPassword:
 *                 value:
 *                   status: false
 *                   message: "User not found."
 */
jwtRouter.post("/login", (0, wrapper_1.default)(jwt_controller_1.loginJWT));
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user and obtain JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *                 description: User's password.
 *               first_name:
 *                 type: string
 *                 example: John
 *                 description: User's first name.
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: User's last name.
 *     responses:
 *       201:
 *         description: Successfully registered user. Returns the user data and a JWT token in the cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the registration was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully registered user."
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request. Indicates missing email, password, first name, or last name, or a user with the provided email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 value:
 *                   status: false
 *                   message: "Email, password, last name, and first name must be provided."
 *               userExists:
 *                 value:
 *                   status: false
 *                   message: "A user with this email already exists!"
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during user registration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 */
jwtRouter.post("/register", (0, wrapper_1.default)(jwt_controller_1.registerJWT));
jwtRouter.get("/callback", passport.authenticate("jwt", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = jwtRouter;
