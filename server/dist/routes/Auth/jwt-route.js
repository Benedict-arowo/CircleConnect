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
const CustomError_1 = __importDefault(require("../../middlewear/CustomError"));
const status_codes_1 = require("http-status-codes/build/cjs/status-codes");
const client_1 = require("@prisma/client");
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const argon = require("argon2");
const express = require("express");
const jwtRouter = express.Router();
const passport = require("passport");
const prisma = new client_1.PrismaClient();
const jwt = require("jsonwebtoken");
jwtRouter.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({ status: "success", user: req.user });
});
jwtRouter.post("/login", (0, wrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError_1.default("Email, and password must be provided.", status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const User = yield prisma.user.findUnique({
        where: { email },
    });
    if (!User) {
        throw new CustomError_1.default("User not found.", status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (!User.password)
        throw new CustomError_1.default("Try using google or github to sign into this account.", status_codes_1.StatusCodes.BAD_REQUEST);
    let passwordIsValid = yield argon.verify(User.password, password);
    console.log(password);
    console.log(passwordIsValid);
    if (passwordIsValid) {
        const token = jwt.sign({
            id: User.id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res
            .cookie("jwtToken", token, { httpOnly: true })
            .status(status_codes_1.StatusCodes.ACCEPTED)
            .json({
            success: true,
            message: "Successfully logged in.",
            data: Object.assign(Object.assign({}, User), { password: null }),
        });
    }
    else {
        throw new CustomError_1.default("Invalid password provided.", status_codes_1.StatusCodes.BAD_REQUEST);
    }
})));
jwtRouter.post("/register", (0, wrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password) {
        throw new CustomError_1.default("Email, and password must be provided.", status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (!first_name || !last_name)
        throw new CustomError_1.default("First name and last name must be provided.", status_codes_1.StatusCodes.BAD_REQUEST);
    // Todo: Make sure password is strong.
    const hashedPassword = yield argon.hash(password);
    try {
        const User = yield prisma.user.create({
            data: {
                email,
                first_name,
                last_name,
                password: hashedPassword,
            },
        });
        const token = jwt.sign({
            id: User.id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res
            .cookie("jwtToken", token, { httpOnly: true })
            .status(status_codes_1.StatusCodes.ACCEPTED)
            .json({
            success: true,
            message: "Successfully registered user.",
            data: Object.assign(Object.assign({}, User), { password: undefined, token: token }),
        });
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                throw new CustomError_1.default("A user with this email already exists!", status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        else {
            throw new CustomError_1.default(e.message, status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
})));
jwtRouter.get("/callback", passport.authenticate("jwt", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.SIGN_IN_SUCCESSFULL_ROUTE);
});
exports.default = jwtRouter;
