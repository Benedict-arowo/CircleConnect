import {
	createReview,
	deleteReview,
	editReview,
	getReviews,
} from "../controllers/project-review-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import { validateParamsID, validateReview } from "../middlewares/validators";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const projectReviewsRouter = express.Router();

projectReviewsRouter
	.route("/:id")
	.get(validateParamsID, wrapper(getReviews))
	.post(isLoggedIn, validateParamsID, validateReview, wrapper(createReview))
	.patch(isLoggedIn, validateParamsID, validateReview, wrapper(editReview))
	.delete(isLoggedIn, validateParamsID, wrapper(deleteReview));

export default projectReviewsRouter;
