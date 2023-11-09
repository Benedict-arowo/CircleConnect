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
const auth_route_1 = __importDefault(require("./routes/Auth/auth-route"));
const isLoggedIn_1 = __importDefault(require("./middlewear/isLoggedIn"));
const google_route_1 = __importDefault(require("./routes/Auth/google-route"));
const github_route_1 = __importDefault(require("./routes/Auth/github-route"));
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { PrismaClient } = require("@prisma/client");
require("./controllers/Auth/google-passport");
require("./controllers/Auth/github-passport");
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
app.use("", (0, morgan_1.default)("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
const port = process.env.PORT;
app.use("/auth/google", google_route_1.default);
app.use("/auth/github", github_route_1.default);
app.use("/", auth_route_1.default);
app.get("/", isLoggedIn_1.default, (0, wrapper_1.default)((req, res) => {
    res.json({ msg: "Hello World!", user: req.user });
}));
app.use(ErrorHandler_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
