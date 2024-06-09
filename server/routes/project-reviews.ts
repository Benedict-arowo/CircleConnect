import {
	createReview,
	deleteReview,
	editReview,
	getReviews,
} from "../controllers/project-review-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import {
	idSchema,
	validateBody,
	validateParams,
} from "../middlewares/validators";
import { reviewSchema } from "../middlewares/validators/schema/review";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const projectReviewsRouter = express.Router();

projectReviewsRouter
	.route("/:id")
	.get(validateParams(idSchema), wrapper(getReviews))
	.post(
		isLoggedIn,
		validateParams(idSchema),
		validateBody(reviewSchema),
		wrapper(createReview)
	)
	.patch(
		isLoggedIn,
		validateParams(idSchema),
		validateBody(reviewSchema),
		wrapper(editReview)
	)
	.delete(isLoggedIn, validateParams(idSchema), wrapper(deleteReview));

export default projectReviewsRouter;
