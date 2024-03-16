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
import { validateBody, validateParams } from "../middlewares/validators";
import {
	circleIdSchema,
	circleSchema,
} from "../middlewares/validators/schema/circle";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const circleRouter = express.Router();

circleRouter
	.route("/")
	.get(wrapper(getCircles))
	.post(isLoggedIn, validateBody(circleSchema), wrapper(createCircle));

circleRouter
	.route("/:id")
	.get(validateParams(circleIdSchema), wrapper(getCircle))
	.patch(isLoggedIn, validateParams(circleIdSchema), wrapper(editCircle))
	.delete(isLoggedIn, validateParams(circleIdSchema), wrapper(deleteCircle));

circleRouter
	.route("/:id/leave")
	.patch(isLoggedIn, validateParams(circleIdSchema), wrapper(leaveCircle));

circleRouter
	.route("/request/join/:id")
	.post(
		isLoggedIn,
		validateParams(circleIdSchema),
		wrapper(requestToJoinCircle)
	);

circleRouter
	.route("/request/leave/:id")
	.post(
		isLoggedIn,
		validateParams(circleIdSchema),
		wrapper(removeCircleRequest)
	);

export default circleRouter;
