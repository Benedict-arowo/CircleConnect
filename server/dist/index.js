"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const wrapper_1 = __importDefault(require("./middlewear/wrapper"));
const ErrorHandler_1 = __importDefault(require("./middlewear/ErrorHandler"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
const isLoggedIn_1 = __importDefault(require("./middlewear/isLoggedIn"));
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { PrismaClient } = require("@prisma/client");
require("./passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new PrismaClient();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        prisma,
        tableName: process.env.SESSION_TABLE_NAME, // Name of the session table in database
    }),
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use("", (0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
const port = process.env.PORT;
app.use("/", auth_route_1.default);
app.get("/", isLoggedIn_1.default, (0, wrapper_1.default)((req, res) => {
    res.json({ msg: "Hello World!", user: req.user });
}));
app.use(ErrorHandler_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
