import {
	createReview,
	deleteReview,
	editReview,
	getReviews,
} from "../controllers/project-review-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const projectReviewsRouter = express.Router();

projectReviewsRouter
	.route("/:id")
	.get(wrapper(getReviews))
	.post(isLoggedIn, wrapper(createReview))
	.patch(isLoggedIn, wrapper(editReview))
	.delete(isLoggedIn, wrapper(deleteReview));

export default projectReviewsRouter;
