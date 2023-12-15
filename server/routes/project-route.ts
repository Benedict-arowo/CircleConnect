import {
	addProjectToCircle,
	createProject,
	deleteProject,
	editProject,
	getProject,
	getProjects,
	removeProjectFromCircle,
} from "../controllers/project-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

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
	.patch(isLoggedIn, wrapper(addProjectToCircle));
projectRouter
	.route("/:id/removeFromCircle")
	.delete(isLoggedIn, wrapper(removeProjectFromCircle));

export default projectRouter;
