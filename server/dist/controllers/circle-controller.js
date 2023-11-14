"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCircle = exports.editCircle = exports.createCircle = exports.getCircle = exports.getCircles = void 0;
const getCircles = (req, res) => {
    res.json({ page: "getCircles" });
};
exports.getCircles = getCircles;
const getCircle = (req, res) => {
    res.json({ page: "getCircle" });
};
exports.getCircle = getCircle;
const createCircle = (req, res) => {
    res.json({ page: "createCircle" });
};
exports.createCircle = createCircle;
const editCircle = (req, res) => {
    res.json({ page: "editCircle" });
};
exports.editCircle = editCircle;
const deleteCircle = (req, res) => {
    res.json({ page: "deleteCircle" });
};
exports.deleteCircle = deleteCircle;
