import {
	createRole,
	deleteRole,
	editRole,
	getRole,
	getRoles,
} from "../controllers/roles-controller";
import isLoggedIn from "../middlewear/isLoggedIn";
import wrapper from "../middlewear/wrapper";

const express = require("express");
const roleRouter = express.Router();

roleRouter
	.route("/")
	.get(wrapper(getRoles))
	.post(isLoggedIn, wrapper(createRole));

roleRouter
	.route("/:id")
	.get(wrapper(getRole))
	.patch(isLoggedIn, wrapper(editRole))
	.delete(isLoggedIn, wrapper(deleteRole));

export default roleRouter;
