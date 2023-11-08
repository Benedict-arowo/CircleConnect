"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
};
exports.default = isLoggedIn;
