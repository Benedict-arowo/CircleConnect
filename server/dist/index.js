"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandler_1 = __importDefault(require("./middlewear/ErrorHandler"));
const auth_route_1 = __importDefault(require("./routes/Auth/auth-route"));
const google_route_1 = __importDefault(require("./routes/Auth/google-route"));
const github_route_1 = __importDefault(require("./routes/Auth/github-route"));
const jwt_route_1 = __importDefault(require("./routes/Auth/jwt-route"));
const dotenv_1 = __importDefault(require("dotenv"));
const circle_route_1 = __importDefault(require("./routes/circle-route"));
const rarting_route_1 = __importDefault(require("./routes/rarting-route"));
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
dotenv_1.default.config();
const makeApp = (database) => {
    const app = (0, express_1.default)();
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            prisma: database,
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
    require("./controllers/Auth/google-passport");
    require("./controllers/Auth/github-passport");
    require("./controllers/Auth/jwt-passport");
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use("/auth/google", google_route_1.default);
    app.use("/auth/github", github_route_1.default);
    app.use("/auth/jwt", jwt_route_1.default);
    app.use("/", auth_route_1.default);
    app.use("/circle", circle_route_1.default);
    app.use("/rating", rarting_route_1.default);
    app.use(ErrorHandler_1.default);
    return app;
};
exports.default = makeApp;
