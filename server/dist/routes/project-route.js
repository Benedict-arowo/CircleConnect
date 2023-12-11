"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_controller_1 = require("../controllers/project-controller");
const isLoggedIn_1 = __importDefault(require("../middlewear/isLoggedIn"));
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const projectRouter = express.Router();
projectRouter
    .route("/")
    .get((0, wrapper_1.default)(project_controller_1.getProjects))
    .post(isLoggedIn_1.default, (0, wrapper_1.default)(project_controller_1.createProject));
projectRouter
    .route("/:id")
    .get((0, wrapper_1.default)(project_controller_1.getProject))
    .patch(isLoggedIn_1.default, (0, wrapper_1.default)(project_controller_1.editProject))
    .delete(isLoggedIn_1.default, (0, wrapper_1.default)(project_controller_1.deleteProject));
exports.default = projectRouter;
