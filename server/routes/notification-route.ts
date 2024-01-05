/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The notification API route
 */

import {
	deleteNotification,
	getNotifications,
} from "../controllers/notifications-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const notificationRouter = express.Router();

notificationRouter.get("/", isLoggedIn, wrapper(getNotifications));
notificationRouter.delete("/:id", isLoggedIn, wrapper(deleteNotification));

export default notificationRouter;
