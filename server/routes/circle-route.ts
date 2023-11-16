import {
	createCircle,
	deleteCircle,
	editCircle,
	getCircle,
	getCircles,
} from "../controllers/circle-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const circleRouter = express.Router();

circleRouter
	.route("/")
	.get(wrapper(getCircles))
	.post(isLoggedIn, wrapper(createCircle));

circleRouter
	.route("/:id")
	.get(wrapper(getCircle))
	.patch(isLoggedIn, wrapper(editCircle))
	.delete(isLoggedIn, wrapper(deleteCircle));

export default circleRouter;