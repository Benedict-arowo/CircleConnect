"use strict";
/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The notification API route
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifications_controller_1 = require("../controllers/notifications-controller");
const isLoggedIn_1 = __importDefault(require("../middlewear/isLoggedIn"));
const wrapper_1 = __importDefault(require("../middlewear/wrapper"));
const express = require("express");
const notificationRouter = express.Router();
notificationRouter.get("/", isLoggedIn_1.default, (0, wrapper_1.default)(notifications_controller_1.getNotifications));
exports.default = notificationRouter;
