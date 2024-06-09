import {
	deleteNotification,
	getNotification,
	getNotifications,
	markAllAsRead,
	markAsRead,
	markAsUnread,
} from "../controllers/notifications-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const notificationRouter = express.Router();

notificationRouter.get("/", isLoggedIn, wrapper(getNotifications));

notificationRouter
	.route("/:id")
	.get(isLoggedIn, wrapper(getNotification))
	.delete(isLoggedIn, wrapper(deleteNotification));

notificationRouter.patch("/markAll", isLoggedIn, wrapper(markAllAsRead));
notificationRouter.patch("/:id/markAsRead", isLoggedIn, wrapper(markAsRead));
notificationRouter.patch(
	"/:id/markAsUnread",
	isLoggedIn,
	wrapper(markAsUnread)
);

export default notificationRouter;
