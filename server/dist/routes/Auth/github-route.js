"use strict";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const githubRouter = express.Router();
const passport = require("passport");
githubRouter.get("/", passport.authenticate("github", { scope: ["user:email"] }));
/**
 * @swagger
 * /github:
 *   get:
 *     summary: Initiate GitHub authentication
 *     tags:
 *       - Authentication
 *     description: Initiates the GitHub authentication process with user email scope.
 *     responses:
 *       200:
 *         description: Successfully initiated GitHub authentication.
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
 *                   example: Initiated GitHub authentication successfully.
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
 * /github/callback:
 *   get:
 *     summary: Callback for GitHub authentication
 *     tags:
 *       - Authentication
 *     description: Callback endpoint for GitHub authentication. Handles successful and failed authentication redirects.
 *     responses:
 *       302:
 *         description: Redirects to the configured success route upon successful GitHub authentication.
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during GitHub authentication callback.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/Error"
 *             example:
 *               status: error
 *               message: Internal Server Error
 */
githubRouter.get("/callback", passport.authenticate("github", {
    failureRedirect: process.env.FAILURE_REDIRECT || "/",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = githubRouter;
