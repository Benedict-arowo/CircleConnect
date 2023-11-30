import {
	createRating,
	editRating,
	getRatings,
} from "../controllers/rating-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const ratingRouter = express.Router();

ratingRouter
	.route("/")
	.get(wrapper(getRatings))
	.post(isLoggedIn, wrapper(createRating));

ratingRouter.route("/:id").patch(isLoggedIn, wrapper(editRating));

export default ratingRouter;
