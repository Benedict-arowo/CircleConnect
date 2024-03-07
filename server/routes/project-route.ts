import {
	createProject,
	deleteProject,
	editProject,
	getProject,
	getProjects,
	manageProjectCircle,
	rateProject,
} from "../controllers/project-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const projectRouter = express.Router();

projectRouter
	.route("/")
	.get(wrapper(getProjects))
	.post(isLoggedIn, wrapper(createProject));

projectRouter
	.route("/:id")
	.get(wrapper(getProject))
	.patch(isLoggedIn, wrapper(editProject))
	.delete(isLoggedIn, wrapper(deleteProject));

projectRouter
	.route("/:id/addToCircle")
	.patch(isLoggedIn, wrapper(manageProjectCircle));
// projectRouter
// 	.route("/:id/removeFromCircle")
// 	.delete(isLoggedIn, wrapper(removeProjectFromCircle));

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

projectRouter.route("/:id/addRating").patch(isLoggedIn, wrapper(rateProject));
export default projectRouter;
