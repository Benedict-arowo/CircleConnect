"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const router = express.Router();
router.route("/test").get((0, wrapper_1.default)((req, res) => {
    return res.json({ hello: "hi" });
}));
exports.default = router;
