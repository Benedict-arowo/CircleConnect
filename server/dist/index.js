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
const project_route_1 = __importDefault(require("./routes/project-route"));
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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
    const options = {
        definition: {
            openapi: "3.1.0",
            info: {
                title: "CircleConnect API",
                version: "1.0.0",
                description: "API for an app, CircleConnect which is a versatile web application designed to empower users to effortlessly create and manage circles or groups, facilitating project sharing, collaboration, and transparency.",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                },
                contact: {
                    name: "Benedict",
                    email: "benedict.arowo@gmail.com",
                },
            },
            servers: [
                {
                    url: "http://localhost:3000",
                },
            ],
        },
        apis: ["./routes/*.ts", , "./routes/Auth/*.ts"],
    };
    const specs = swaggerJsdoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
    app.use("/auth/google", google_route_1.default);
    app.use("/auth/github", github_route_1.default);
    app.use("/auth/jwt", jwt_route_1.default);
    app.use("/", auth_route_1.default);
    app.use("/circle", circle_route_1.default);
    app.use("/project", project_route_1.default);
    app.use("/rating", rarting_route_1.default);
    app.use(ErrorHandler_1.default);
    return app;
};
exports.default = makeApp;
