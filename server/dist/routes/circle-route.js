"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const circle_controller_1 = require("../controllers/circle-controller");
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const circleRouter = express.Router();
circleRouter.route("/").get((0, wrapper_1.default)(circle_controller_1.getCircles)).post((0, wrapper_1.default)(circle_controller_1.createCircle));
circleRouter
    .route("/:id")
    .get((0, wrapper_1.default)(circle_controller_1.getCircle))
    .patch((0, wrapper_1.default)(circle_controller_1.editCircle))
    .delete((0, wrapper_1.default)(circle_controller_1.deleteCircle));
exports.default = circleRouter;
