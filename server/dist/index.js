"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const wrapper_1 = __importDefault(require("./middlewear/wrapper"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use("", (0, morgan_1.default)("dev"));
app.get("/", (0, wrapper_1.default)((req, res) => {
    throw new Error("Test");
    res.json({ msg: "Hello World!" });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
