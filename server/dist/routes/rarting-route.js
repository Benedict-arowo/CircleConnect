"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rating_controller_1 = require("../controllers/rating-controller");
const isLoggedIn_1 = __importDefault(require("../middlewear/isLoggedIn"));
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const ratingRouter = express.Router();
ratingRouter
    .route("/")
    .get((0, wrapper_1.default)(rating_controller_1.getRatings))
    .post(isLoggedIn_1.default, (0, wrapper_1.default)(rating_controller_1.createRating));
ratingRouter.route("/:id").patch(isLoggedIn_1.default, (0, wrapper_1.default)(rating_controller_1.editRating));
exports.default = ratingRouter;
