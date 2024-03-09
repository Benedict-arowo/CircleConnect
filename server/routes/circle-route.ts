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
import isLoggedIn from "../middlewares/isLoggedIn";
import { validateCreateCircle } from "../middlewares/validators/circleValidators";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const circleRouter = express.Router();

circleRouter
	.route("/")
	.get(wrapper(getCircles))
	.post(isLoggedIn, validateCreateCircle, wrapper(createCircle));

circleRouter
	.route("/:id")
	.get(wrapper(getCircle))
	.patch(isLoggedIn, wrapper(editCircle))
	.delete(isLoggedIn, wrapper(deleteCircle));

circleRouter.route("/:id/leave").patch(isLoggedIn, wrapper(leaveCircle));

circleRouter
	.route("/request/join/:id")
	.post(isLoggedIn, wrapper(requestToJoinCircle));

circleRouter
	.route("/request/leave/:id")
	.post(isLoggedIn, wrapper(removeCircleRequest));

export default circleRouter;
