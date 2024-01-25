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
const projectRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the project.
 *         name:
 *           type: string
 *           description: The name of the project.
 *         description:
 *           type: string
 *           description: The description of the project.
 *         github:
 *           type: string
 *           description: The GitHub link of the project (optional).
 *         liveLink:
 *           type: string
 *           description: The live link of the project (optional).
 *         techUsed:
 *           type: array
 *           items:
 *             type: string
 *           description: The array of technologies used in the project.
 *         pictures:
 *           type: array
 *           items:
 *             type: string
 *           description: The array of picture URLs associated with the project.
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *           description: The user who created the project.
 *         circleVisibility:
 *           type: string
 *           enum: [PUBLIC, PRIVATE]
 *           description: The visibility of the project within a circle.
 *         pinned:
 *           type: boolean
 *           description: Indicates whether the project is pinned.
 *         rating:
 *           type: array
 *           description: The array of ratings for the project.
 *         circleId:
 *           type: integer
 *           description: The ID of the circle associated with the project.
 *         circle:
 *           $ref: '#/components/schemas/Circle'
 *           description: The circle associated with the project.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the project was created.
 *       example:
 *         id: "1"
 *         name: "Sample Project"
 *         description: "Sample project description."
 *         github: "https://github.com/sample/project"
 *         liveLink: "https://sample-project.com"
 *         techUsed: ["Node.js", "React", "Express"]
 *         pictures: ["https://sample-project.com/image1.jpg", "https://sample-project.com/image2.jpg"]
 *         createdBy:
 *           id: "101"
 *           username: "john_doe"
 *           email: "john.doe@example.com"
 *         circleVisibility: "PUBLIC"
 *         pinned: false
 *         rating: []
 *         circleId: 1
 *         circle:
 *           id: 1
 *           members: []
 *           lead:
 *             id: "101"
 *             username: "circle_lead"
 *             email: "circle.lead@example.com"
 *           colead: null
 *           projects: []
 *           description: "Sample Circle Description"
 *           averageUserRating: 0.0
 *           rating: []
 *           requests: []
 *           createdAt: "2023-01-01T12:34:56.789Z"
 *         createdAt: "2023-01-01T12:34:56.789Z"
 */

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get a list of projects
 *     tags: [Project]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The maximum number of projects to return (default is 10).
 *         example: 10
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *           enum: [circle_id-asc, circle_id-desc, name-asc, name-desc, rating-asc, rating-desc]
 *           description: The sorting order for projects based on circle ID, rating or name.
 *         example: circle_id-asc
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           description: The ID of the user.
 *       - in: query
 *         name: circleId
 *         schema:
 *           type: string
 *           description: The ID of the circle.
 *       - in: query
 *         name: pinned
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *           description: Flag to filter pinned projects.
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidLimit:
 *                 value:
 *                   success: false
 *                   message: 'Invalid limit provided.'
 *               invalidSorting:
 *                 value:
 *                   success: false
 *                   message: 'Invalid sorting parameters.'
 *
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the project. (Required)
 *               description:
 *                 type: string
 *                 description: The description of the project. (Required)
 *               circleId:
 *                 type: integer
 *                 description: The ID of the circle associated with the project (optional).
 *               techUsed:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The array of technologies used in the project (optional).
 *               github:
 *                 type: string
 *                 description: The GitHub link of the project (optional).
 *               liveLink:
 *                 type: string
 *                 description: The live link of the project (optional).
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The array of picture URLs associated with the project (optional).
 *             required:
 *               - name
 *               - description
 *             example:
 *               name: "New Project"
 *               description: "Description of the new project."
 *               circleId: 1
 *               techUsed: ["Node.js", "React", "Express"]
 *               github: "https://github.com/new/project"
 *               liveLink: "https://new-project.com"
 *               pictures: ["https://new-project.com/image1.jpg", "https://new-project.com/image2.jpg"]
 *     responses:
 *       200:
 *         description: Project created successfully
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
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidNameDescription:
 *                 value:
 *                   success: false
 *                   message: 'Name, and Description must be provided.'
 *               invalidCircle:
 *                 value:
 *                   success: false
 *                   message: 'Invalid circle provided or insufficient permissions.'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: 'You must be authenticated to access this route'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: 'Internal Server Error'
 */

projectRouter
	.route("/")
	.get(wrapper(getProjects))
	.post(isLoggedIn, wrapper(createProject));

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Get details of a specific project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the project.
 *         example: 1
 *     responses:
 *       200:
 *         description: Project details retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the project.
 *                     name:
 *                       type: string
 *                       description: The name of the project.
 *                     description:
 *                       type: string
 *                       description: The description of the project.
 *                     circle:
 *                       $ref: '#/components/schemas/Circle'
 *                       description: The circle associated with the project.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the project was created.
 *                     createdBy:
 *                       $ref: '#/components/schemas/UserMinimized'
 *                       description: The user who created the project.
 *                     liveLink:
 *                       type: string
 *                       description: The live link of the project.
 *                     github:
 *                       type: string
 *                       description: The GitHub link of the project.
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
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Project not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Internal Server Error'
 *   patch:
 *     summary: Update a specific project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the project.
 *         example: 1
 *       - in: body
 *         name: body
 *         description: Project data to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The updated name of the project.
 *               example: Updated Project Name
 *             description:
 *               type: string
 *               description: The updated description of the project.
 *               example: Updated project description.
 *             github:
 *               type: string
 *               description: The updated GitHub link of the project.
 *               example: https://github.com/updated-repo
 *             techUsed:
 *               type: array
 *               items:
 *                 type: string
 *               description: The updated list of technologies used in the project.
 *               example:
 *                 - React
 *                 - Node.js
 *             liveLink:
 *               type: string
 *               description: The updated live link of the project.
 *               example: https://updated-project.com
 *             visibility:
 *               type: string
 *               enum: [PUBLIC, PRIVATE]
 *               description: The updated visibility of the project.
 *               example: PUBLIC
 *             pictures:
 *               type: array
 *               items:
 *                 type: string
 *               description: The updated list of picture URLs associated with the project.
 *               example:
 *                 - https://updated-project.com/image1.jpg
 *                 - https://updated-project.com/image2.jpg
 *             pinned:
 *               type: boolean
 *               description: Whether the project should be pinned or not.
 *               example: true
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidVisibility:
 *                 value:
 *                   success: false
 *                   message: 'Invalid visibility value provided.'
 *               invalidpinned:
 *                 value:
 *                   success: false
 *                   message: 'Invalid pinned value provided.'
 *               alreadyPinned:
 *                 value:
 *                   success: false
 *                   message: 'Project is already pinned.'
 *               alreadyUnpinned:
 *                 value:
 *                   success: false
 *                   message: 'Project is already unpinned.'
 *               noPermission:
 *                 value:
 *                   success: false
 *                   message: 'You do not have permission to pin/unpin this project.'
 *               techUsedArray:
 *                 value:
 *                   success: false
 *                   message: 'techUsed must be an array.'
 *               techUsedArrayNoString:
 *                 value:
 *                   success: false
 *                   message: 'techUsed array values must all be strings.'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'You are not authorized to access this route.'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'Internal Server Error'
 *
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to delete
 *     responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You do not have permission to delete this project.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Project not found.
 */

projectRouter
	.route("/:id")
	.get(wrapper(getProject))
	.patch(isLoggedIn, wrapper(editProject))
	.delete(isLoggedIn, wrapper(deleteProject));

/**
 * @swagger
 * /project/{id}/circle:
 *   patch:
 *     summary: Add a project to a circle
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the project.
 *         example: 1
 *       - in: body
 *         name: body
 *         description: Circle ID to add the project to.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             circleId:
 *               type: integer
 *               description: The ID of the circle to add the project to.
 *               example: 1
 *     responses:
 *       200:
 *         description: Project added to circle successfully
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
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             examples:
 *               invalidCircleId:
 *                 value:
 *                   error: Invalid circle ID provided.
 *               permissionDenied:
 *                 value:
 *                   error: You do not have permission to update this project's circle.
 *               projectNotFound:
 *                 value:
 *                   error: Project not found.
 *               projectAlreadyInCircle:
 *                 value:
 *                   error: The project is already in the provided circle.
 *               invalidRequestBody:
 *                 value:
 *                   error: Invalid request body. Circle ID must be provided.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingProject:
 *                 value:
 *                   success: false
 *                   message: 'Project with a matching ID not found.'
 *               missingCircle:
 *                 value:
 *                   success: false
 *                   message: 'Circle with a matching ID not found.'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: false
 *               message: 'You do not have permission to add this project to this circle.'
 *
 *   delete:
 *     summary: Remove project from circle by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to remove from the circle
 *       - in: body
 *         name: circleId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             circleId:
 *               type: string
 *         description: The ID of the circle from which to remove the project
 *     responses:
 *       200:
 *         description: Successful removal
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             examples:
 *               invalidCircleId:
 *                 value:
 *                   success: false
 *                   message: Invalid circle ID provided.
 *               permissionDenied:
 *                 value:
 *                   success: false
 *                   message: You do not have permission to remove this project from the circle.
 *               projectNotInCircle:
 *                 value:
 *                   success: false
 *                   message: The project is not in the provided circle.
 *               invalidRequestBody:
 *                 value:
 *                   success: false
 *                   message: Invalid request body. Circle ID must be provided.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             examples:
 *               projectNotFound:
 *                 value:
 *                   success: false
 *                   message: Project not found.
 *               circleNotFound:
 *                 value:
 *                   success: false
 *                   message: Circle not found.
 */

projectRouter
	.route("/:id/addToCircle")
	.patch(isLoggedIn, wrapper(addProjectToCircle));
projectRouter
	.route("/:id/removeFromCircle")
	.delete(isLoggedIn, wrapper(removeProjectFromCircle));

/**
 * @swagger
 * /project/{id}/rating:
 *   post:
 *     summary: Add Rating to Project
 *     tags: [Project]
 *     description: Add a rating to a project.
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         description: "ID of the project."
 *         required: true
 *         type: "string"
 *       - name: "rating"
 *         in: "body"
 *         description: "Rating to be added to the project."
 *         required: true
 *         schema:
 *           type: "object"
 *           properties:
 *             rating:
 *               type: "number"
 *               minimum: 1
 *               maximum: 5
 *               description: "The rating value (between 1 and 5)."
 *     responses:
 *       201:
 *         description: "Rating added successfully."
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
 *                     projectId:
 *                       type: "string"
 *                       description: "ID of the project."
 *                     userId:
 *                       type: "string"
 *                       description: "ID of the user who added the rating."
 *                     rating:
 *                       type: "number"
 *                       description: "The added rating value."
 *       400:
 *         description: "Bad Request. Invalid input."
 *         content:
 *           application/json:
 *             examples:
 *               invalidInput:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid input provided. Rating must be a number between 1 and 5."
 *               missingRating:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Rating must be provided."
 *               invalidRatingValue:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid rating value. Rating must be a number between 1 and 5."
 *       404:
 *         description: "Project not found."
 *         content:
 *           application/json:
 *             example:
 *               value:
 *                 success: false
 *                 error:
 *                   message: "Project not found."
 */

projectRouter
	.route("/:id/addRating")
	.patch(isLoggedIn, wrapper(addRatingToProject));
export default projectRouter;
