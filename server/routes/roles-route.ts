import {
	createRole,
	deleteRole,
	editRole,
	getRole,
	getRoles,
} from "../controllers/roles-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import { idSchema, validateParams } from "../middlewares/validators";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const roleRouter = express.Router();

roleRouter
	.route("/")
	.get(wrapper(getRoles))
	.post(isLoggedIn, wrapper(createRole));

roleRouter
	.route("/:id")
	.get(validateParams(idSchema), wrapper(getRole))
	.patch(isLoggedIn, validateParams(idSchema), wrapper(editRole))
	.delete(isLoggedIn, validateParams(idSchema), wrapper(deleteRole));

export default roleRouter;
