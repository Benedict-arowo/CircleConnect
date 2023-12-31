"use strict";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API route
 */
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
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const isLoggedIn_1 = __importDefault(require("../../middlewear/isLoggedIn"));
const http_status_codes_1 = require("http-status-codes");
const logout_1 = __importDefault(require("../../controllers/Auth/logout"));
const db_1 = __importDefault(require("../../model/db"));
const utils_1 = require("../../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
router.get("/user", isLoggedIn_1.default, (0, wrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: This route is currently just for testing purposes.
    let user = yield db_1.default.user.findUnique({
        where: { id: req.user.id },
        select: utils_1.UserSelectFull,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
})));
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out user and clear session
 *     tags:
 *       - Authentication
 *     description: Logs out the user, clears the JWT token cookie, and redirects to the configured logout redirect route.
 *     responses:
 *       302:
 *         description: Redirects to the configured logout redirect route after successful logout.
 *       500:
 *         description: Internal Server Error. Indicates an unexpected error during the logout process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/Error"
 *             example:
 *               status: error
 *               message: Internal Server Error
 */
router.get("/logout", isLoggedIn_1.default, (0, wrapper_1.default)(logout_1.default));
exports.default = router;
