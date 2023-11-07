"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandler_1 = __importDefault(require("./middlewear/ErrorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use("", (0, morgan_1.default)("dev"));
app.get("/", (req, res) => {
    res.json({ msg: "Hello World!" });
});
app.use(ErrorHandler_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
