import wrapper from "../../middlewear/wrapper";
import isLoggedIn from "../../middlewear/isLoggedIn";
import logout from "../../controllers/Auth/logout";

require("dotenv").config();

const express = require("express");
const router = express.Router();

router.get("/logout", isLoggedIn, wrapper(logout));

export default router;
