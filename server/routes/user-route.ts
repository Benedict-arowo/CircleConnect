import {
	createUser,
	deleteUser,
	editUser,
	getUser,
	getUsers,
} from "../controllers/user-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const userRouter = express.Router();

userRouter
	.route("/")
	.get(wrapper(getUsers))
	.post(isLoggedIn, wrapper(createUser));

userRouter
	.route("/:id")
	.get(wrapper(getUser))
	.patch(isLoggedIn, wrapper(editUser))
	.delete(isLoggedIn, wrapper(deleteUser));

export default userRouter;
