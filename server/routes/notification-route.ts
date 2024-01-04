/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The notification API route
 */

import { getNotifications } from "../controllers/notifications-controller";
import {
	addProjectToCircle,
	createProject,
	deleteProject,
	editProject,
	getProject,
	getProjects,
	removeProjectFromCircle,
	addRatingToProject,
} from "../controllers/project-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const notificationRouter = express.Router();

notificationRouter.get("/", isLoggedIn, wrapper(getNotifications));

export default notificationRouter;
