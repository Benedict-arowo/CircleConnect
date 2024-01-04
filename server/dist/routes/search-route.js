"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_controller_1 = require("../controllers/search-controller");
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const searchRouter = express.Router();
searchRouter
    .route("/")
    .get((0, wrapper_1.default)(search_controller_1.getSearches))
    .post((0, wrapper_1.default)(search_controller_1.createOrUpdateSearch));
exports.default = searchRouter;
