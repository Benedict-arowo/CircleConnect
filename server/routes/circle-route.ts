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
import {
	validateCircleId,
	validateCreateCircle,
} from "../middlewares/validators/circleValidators";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const circleRouter = express.Router();

circleRouter
	.route("/")
	.get(wrapper(getCircles))
	.post(isLoggedIn, validateCreateCircle, wrapper(createCircle));

circleRouter
	.route("/:id")
	.get(validateCircleId, wrapper(getCircle))
	.patch(isLoggedIn, validateCircleId, wrapper(editCircle))
	.delete(isLoggedIn, validateCircleId, wrapper(deleteCircle));

circleRouter
	.route("/:id/leave")
	.patch(isLoggedIn, validateCircleId, wrapper(leaveCircle));

circleRouter
	.route("/request/join/:id")
	.post(isLoggedIn, validateCircleId, wrapper(requestToJoinCircle));

circleRouter
	.route("/request/leave/:id")
	.post(isLoggedIn, validateCircleId, wrapper(removeCircleRequest));

export default circleRouter;
