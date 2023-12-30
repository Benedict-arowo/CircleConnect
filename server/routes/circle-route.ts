import {
	createCircle,
	deleteCircle,
	editCircle,
	getCircle,
	getCircles,
	leaveCircle,
	removeCircleRequest,
	requestToJoinCircle,
} from "../controllers/circle-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const circleRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Circle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the circle.
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: The array of users who are members of the circle.
 *         lead:
 *           $ref: '#/components/schemas/User'
 *           description: The user who is the leader of the circle.
 *         colead:
 *           $ref: '#/components/schemas/User'
 *           description: The user who is the co-leader of the circle.
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *           description: The array of projects associated with the circle.
 *         description:
 *           type: string
 *           description: The description of the circle (up to 300 characters).
 *         averageUserRating:
 *           type: number
 *           format: float
 *           description: The average user rating for the circle.
 *         rating:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CircleRating'
 *           description: The array of ratings for the circle.
 *         requests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: The array of users with pending requests to join the circle.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the circle was created.
 *       example:
 *         id: 1
 *         members: []
 *         lead:
 *           id: "101"
 *           username: "john_doe"
 *           email: "john.doe@example.com"
 *         colead: null
 *         projects: []
 *         description: "Sample Circle Description"
 *         averageUserRating: 0.0
 *         rating: []
 *         requests: []
 *         createdAt: "2023-01-01T12:34:56.789Z"
 *
 *
 *     CircleRequestBody:
 *       type: object
 *       required:
 *         - circle_num
 *         - description
 *       properties:
 *         circle_num:
 *           type: integer
 *           description: The circle number assigned to the circle.
 *         description:
 *           type: string
 *           description: The description of the circle (up to 300 characters).
 *       example:
 *         circle_num: 22
 *         description: "Sample Circle Description"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       # Define User schema properties here

 *     Project:
 *       type: object
 *       # Define Project schema properties here

 *     CircleRating:
 *       type: object
 *       # Define CircleRating schema properties here
 */

/**
 * @swagger
 * tags:
 *   name: Circle
 *   description: The circle API route
 * /circle:
 *   post:
 *     summary: Create a new circle
 *     tags: [Circle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CircleRequestBody'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 data:
 *                   $ref: '#/components/schemas/Circle'
 *       401:
 *         description: User is not authorized to create a circle.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "You must be authenticated to access this route"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               example1:
 *                 value:
 *                   success: false
 *                   message: "Circle description must be provided."
 *               example2:
 *                 value:
 *                   success: false
 *                   message: "Description is too short, it must be at least 5 characters"
 *               example3:
 *                 value:
 *                   success: false
 *                   message: "Circle number must be provided and must be a valid number."
 *               example4:
 *                 value:
 *                   success: false
 *                   message: "Circle number must be greater than or equal to zero."
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Error trying to create circle."
 *   get:
 *     summary: Get a list of circles
 *     tags: [Circle]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The maximum number of circles to return (default is 10).
 *         example: 10
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *           enum: [num-asc, num-desc, rating-asc, rating-desc]
 *           description: The sorting order for circles based on circle number or average user rating.
 *         example: num-asc
 *     responses:
 *       200:
 *         description: List of circles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Circle'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               example1:
 *                 value:
 *                   success: false
 *                   message: "Invalid limit provided."
 *               example2:
 *                 value:
 *                   success: false
 *                   message: "Invalid sorting parameters."
 *               example3:
 *                 value:
 *                   success: false
 *                   message: "Invalid limit, must be between 1 and 25."
 */

circleRouter
	.route("/")
	.get(wrapper(getCircles))
	.post(isLoggedIn, wrapper(createCircle));

/**
 * @swagger
 * tags:
 *   name: Circle
 *   description: The circle API route
 * /circle/{id}:
 *   get:
 *     summary: Get details of a specific circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the circle.
 *         example: 1
 *     responses:
 *       200:
 *         description: Circle details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Circle'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'An ID must be provided'
 *       404:
 *         description: Circle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle not found'
 *   delete:
 *     summary: Delete a circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the circle to delete.
 *         example: 1
 *     responses:
 *       200:
 *         description: Circle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'You are not allowed to delete this circle.'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'You are not authorized to access this route.'
 *       404:
 *         description: Circle does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle does not exist.'
 *   patch:
 *     summary: Edit a circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the circle to edit.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The new description of the circle.
 *               request:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user whose request to manage.
 *                   type:
 *                     type: string
 *                     enum: [ACCEPT, DECLINE]
 *                     description: The type of the request action.
 *               removeUser:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user to remove from the circle.
 *               manageUser:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user to manage.
 *                   action:
 *                     type: string
 *                     enum: [PROMOTE, DEMOTE]
 *                     description: The type of the management action.
 *             example:
 *               description: "New Circle Description"
 *               request:
 *                 userId: 2
 *                 type: ACCEPT
 *               removeUser:
 *                 userId: 3
 *               manageUser:
 *                 userId: 4
 *                 action: PROMOTE
 *     responses:
 *       200:
 *         description: Circle edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Circle'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidID:
 *                 value:
 *                   status: false
 *                   message: 'Invalid circle ID provided.'
 *               invalidRequest:
 *                 value:
 *                   status: false
 *                   message: 'Invalid request type.'
 *               invalidRemoveUser:
 *                 value:
 *                   status: false
 *                   message: 'Invalid user ID to remove.'
 *               invalidManageUser:
 *                 value:
 *                   status: false
 *                   message: 'Invalid user ID or action for user management.'
 *               descriptionTooShort:
 *                 value:
 *                   status: false
 *                   message: 'Description is too short, it must be at least 10 characters.'
 *               notCircleMember:
 *                 value:
 *                   status: false
 *                   message: 'User is not a member of this circle.'
 *               notCircleLead:
 *                 value:
 *                   status: false
 *                   message: 'You must be the circle lead or co-lead to manage this operation.'
 *               promoteSelf:
 *                 value:
 *                   status: false
 *                   message: 'You cannot perform this action on yourself.'
 *               noPermission:
 *                 value:
 *                   status: false
 *                   message: 'You do not have the permission to perform this operation.'
 *               demoteMember:
 *                 value:
 *                   status: false
 *                   message: 'Circle member cannot be demoted further!'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "You must be authenticated to access this route"
 *       404:
 *         description: Circle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Internal Server Error'
 */

circleRouter
	.route("/:id")
	.get(wrapper(getCircle))
	.patch(isLoggedIn, wrapper(editCircle))
	.delete(isLoggedIn, wrapper(deleteCircle));

/**
 * @swagger
 * tags:
 *   name: Circle
 *   description: The circle API route
 * /circle/{id}/leave:
 *   patch:
 *     summary: Leave a circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the circle to leave.
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully left the circle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidID:
 *                 value:
 *                   status: false
 *                   message: 'Invalid circle ID provided.'
 *               notCircleMember:
 *                 value:
 *                   status: false
 *                   message: 'You are not a member of this circle.'
 *               notAllowedToLeave:
 *                 value:
 *                   status: false
 *                   message: 'You may not leave this circle.'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'User not authenticated.'
 *       404:
 *         description: Circle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Internal Server Error'
 */
circleRouter.route("/:id/leave").patch(isLoggedIn, wrapper(leaveCircle));

/**
 * @swagger
 * tags:
 *   name: Circle
 *   description: The circle API route
 * /circle/request/join/{id}:
 *   post:
 *     summary: Request to join a circle
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the circle to join.
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully sent a request to join the circle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Circle'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidID:
 *                 value:
 *                   status: false
 *                   message: 'Invalid circle ID provided.'
 *               alreadyCircleLeader:
 *                 value:
 *                   status: false
 *                   message: "You're already a circle leader for this circle."
 *               alreadyCircleMember:
 *                 value:
 *                   status: false
 *                   message: "You're already a member of this circle."
 *               alreadyInRequestList:
 *                 value:
 *                   status: false
 *                   message: "You're already in the request list of this circle."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'User not authenticated.'
 *       404:
 *         description: Circle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle not found'
 *
 */

circleRouter
	.route("/request/join/:id")
	.post(isLoggedIn, wrapper(requestToJoinCircle));

/**
 * @swagger
 * /circle/request/leave/{id}:
 *   post:
 *     summary: Remove user's request to join a circle.
 *     tags: [Circle]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the circle.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success. Returns the updated circle data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Circle'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: "User is not in circle request list."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'User not authenticated.'
 *       404:
 *         description: Circle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Circle not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Internal Server Error'
 */
circleRouter
	.route("/request/leave/:id")
	.post(isLoggedIn, wrapper(removeCircleRequest));

export default circleRouter;
