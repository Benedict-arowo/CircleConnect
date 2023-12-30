"use strict";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const googleRouter = express.Router();
googleRouter.get("/", passport.authenticate("google", { scope: ["email", "profile"] }));
/**
 * @swagger
 * /google:
 *   get:
 *     summary: Initiate Google authentication
 *     tags:
 *       - Authentication
 *     description: Initiates the Google authentication process with email and profile scope.
 *     responses:
 *       200:
 *         description: Successfully initiated Google authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the status of the authentication initiation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Initiated Google authentication successfully.
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during authentication initiation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/Error"
 *             example:
 *               status: error
 *               message: Internal Server Error
 */
/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Callback for Google authentication
 *     tags:
 *       - Authentication
 *     description: Callback endpoint for Google authentication. Handles successful and failed authentication redirects.
 *     responses:
 *       302:
 *         description: Redirects to the configured success route upon successful Google authentication.
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during Google authentication callback.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/Error"
 *             example:
 *               status: error
 *               message: Internal Server Error
 */
googleRouter.get("/callback", passport.authenticate("google", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = googleRouter;
