/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The notification API route
 */

import {
	deleteNotification,
	getNotification,
	getNotifications,
	markAllAsRead,
	markAsRead,
	markAsUnread,
} from "../controllers/notifications-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const notificationRouter = express.Router();

notificationRouter.get("/", isLoggedIn, wrapper(getNotifications));

/**
 * @swagger
 *
 * /notifications:
 *   get:
 *     summary: Get Notifications
 *     tags: [Notification]
 *     description: Retrieve a list of user notifications with optional filtering by status.
 *     parameters:
 *       - name: "status"
 *         in: "query"
 *         description: "Filter notifications by status ('READ' or 'UNREAD'). Omit to retrieve all notifications."
 *         required: false
 *         type: "string"
 *         enum: ["READ", "UNREAD"]
 *     responses:
 *       200:
 *         description: "List of user notifications retrieved successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 success:
 *                   type: "boolean"
 *                   default: true
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       id:
 *                         type: "string"
 *                         description: "ID of the notification."
 *                       content:
 *                         type: "string"
 *                         description: "Content of the notification."
 *                       status:
 *                         type: "string"
 *                         description: "Status of the notification (e.g., 'unread', 'read')."
 *                       url:
 *                         type: "string"
 *                         description: "URL associated with the notification."
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "notification_id_1"
 *                       content: "This is a notification."
 *                       status: "unread"
 *                       url: "https://example.com"
 *                     - id: "notification_id_2"
 *                       content: "Another notification."
 *                       status: "read"
 *                       url: "https://example.com/another"
 *       400:
 *         description: "Bad Request. Invalid input or insufficient permissions."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 success:
 *                   type: "boolean"
 *                   default: false
 *                 error:
 *                   type: "object"
 *                   properties:
 *                     message:
 *                       type: "string"
 *                       description: "Error message describing the issue."
 *             examples:
 *               invalidInput:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid input provided. Please check the request parameters."
 *       404:
 *         description: "User notifications not found."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 success:
 *                   type: "boolean"
 *                   default: false
 *                 error:
 *                   type: "object"
 *                   properties:
 *                     message:
 *                       type: "string"
 *                       description: "Error message indicating no notifications found for the user."
 *             examples:
 *               noNotifications:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "No notifications found for the user."
 * /notifications/{id}:
 *   get:
 *     summary: Get Notification
 *     tags: [Notification]
 *     description: Retrieve details of a user notification by ID.
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         description: "ID of the notification to be retrieved."
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: "Notification details retrieved successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 success:
 *                   type: "boolean"
 *                   default: true
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     id:
 *                       type: "string"
 *                       description: "ID of the notification."
 *                     content:
 *                       type: "string"
 *                       description: "Content of the notification."
 *                     status:
 *                       type: "string"
 *                       description: "Status of the notification (e.g., 'unread', 'read')."
 *                     url:
 *                       type: "string"
 *                       description: "URL associated with the notification."
 *                     user:
 *                       type: "object"
 *                       properties:
 *                         id:
 *                           type: "string"
 *                           description: "ID of the user who owns the notification."
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "notification_id"
 *                     content: "This is a notification."
 *                     status: "unread"
 *                     url: "https://example.com"
 *                     user:
 *                       id: "user_id"
 *       400:
 *         description: "Bad Request. Invalid input or insufficient permissions."
 *         schema:
 *           type: "object"
 *           properties:
 *             success:
 *               type: "boolean"
 *               default: false
 *             error:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   description: "Error message describing the issue."
 *           examples:
 *             invalidInput:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Invalid input provided. Please check the request parameters."
 *             insufficientPermissions:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Insufficient permissions to view this notification."
 *       404:
 *         description: "Notification not found."
 *         schema:
 *           type: "object"
 *           properties:
 *             success:
 *               type: "boolean"
 *               default: false
 *             error:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   description: "Error message indicating notification not found."
 *           examples:
 *             notificationNotFound:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Notification not found."
 *   delete:
 *     summary: Delete Notification
 *     tags: [Notification]
 *     description: Delete a user notification by ID.
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         description: "ID of the notification to be deleted."
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: "Notification deleted successfully."
 *         schema:
 *           type: "object"
 *           properties:
 *             success:
 *               type: "boolean"
 *               default: true
 *       400:
 *         description: "Bad Request. Invalid input or insufficient permissions."
 *         schema:
 *           type: "object"
 *           properties:
 *             success:
 *               type: "boolean"
 *               default: false
 *             error:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   description: "Error message describing the issue."
 *           examples:
 *             invalidInput:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Invalid input provided. Please check the request parameters."
 *             insufficientPermissions:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Insufficient permissions to delete this notification."
 *       404:
 *         description: "Notification not found."
 *         schema:
 *           type: "object"
 *           properties:
 *             success:
 *               type: "boolean"
 *               default: false
 *             error:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   description: "Error message indicating notification not found."
 *           examples:
 *             notificationNotFound:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Notification not found."
 */

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
