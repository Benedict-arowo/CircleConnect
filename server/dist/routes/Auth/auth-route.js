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
const wrapper_1 = __importDefault(require("../../middlewear/wrapper"));
const isLoggedIn_1 = __importDefault(require("../../middlewear/isLoggedIn"));
const http_status_codes_1 = require("http-status-codes");
const logout_1 = __importDefault(require("../../controllers/Auth/logout"));
require("dotenv").config();
const express = require("express");
const router = express.Router();
router.get("/user", isLoggedIn_1.default, (0, wrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: This route is currently just for testing purposes.
    let user = req.user;
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
})));
router.get("/logout", isLoggedIn_1.default, (0, wrapper_1.default)(logout_1.default));
exports.default = router;
