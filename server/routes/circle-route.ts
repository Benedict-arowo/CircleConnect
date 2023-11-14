import {
	createCircle,
	deleteCircle,
	editCircle,
	getCircle,
	getCircles,
} from "../controllers/circle-controller";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const circleRouter = express.Router();

circleRouter.route("/").get(wrapper(getCircles)).post(wrapper(createCircle));

circleRouter
	.route("/:id")
	.get(wrapper(getCircle))
	.patch(wrapper(editCircle))
	.delete(wrapper(deleteCircle));

export default circleRouter;
