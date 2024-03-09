import {
	createRole,
	deleteRole,
	editRole,
	getRole,
	getRoles,
} from "../controllers/roles-controller";
import isLoggedIn from "../middlewares/isLoggedIn";
import { validateParamsID } from "../middlewares/validators";
import wrapper from "../middlewares/wrapper";

const express = require("express");
const roleRouter = express.Router();

roleRouter
	.route("/")
	.get(wrapper(getRoles))
	.post(isLoggedIn, wrapper(createRole));

roleRouter
	.route("/:id")
	.get(validateParamsID, wrapper(getRole))
	.patch(isLoggedIn, validateParamsID, wrapper(editRole))
	.delete(isLoggedIn, validateParamsID, wrapper(deleteRole));

export default roleRouter;
