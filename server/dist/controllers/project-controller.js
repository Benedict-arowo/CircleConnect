"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.editProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = __importDefault(require("../middlewear/CustomError"));
const utils_1 = require("../utils");
const db_1 = __importDefault(require("../model/db"));
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = "10", sortedBy, userId, circleId } = req.query;
    const sortedByValues = [
        "circle_id-asc",
        "circle_id-desc",
        "name-asc",
        "name-desc",
    ];
    if (isNaN(parseInt(limit)))
        throw new CustomError_1.default("Invalid limit provided", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (sortedBy && !sortedByValues.includes(sortedBy)) {
        throw new CustomError_1.default("Invalid sorting parameters", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (Number(limit) > 25 || Number(limit) < 1)
        throw new CustomError_1.default("Invalid limit, must be between 1 and 25", http_status_codes_1.StatusCodes.BAD_REQUEST);
    console.log(circleId
        ? !isNaN(Number(circleId))
            ? Number(circleId)
            : undefined
        : undefined);
    const Projects = yield db_1.default.project.findMany({
        where: {
            OR: circleId
                ? [
                    {
                        circleId: circleId
                            ? !isNaN(Number(circleId))
                                ? Number(circleId)
                                : undefined
                            : undefined,
                    },
                    // {
                    // 	createdById: userId ? userId : undefined,
                    // },
                ]
                : undefined,
        },
        orderBy: {
            circleId: (sortedBy === null || sortedBy === void 0 ? void 0 : sortedBy.startsWith("circle_id"))
                ? sortedBy === "circle_id-asc"
                    ? "asc"
                    : "desc"
                : undefined,
            name: (sortedBy === null || sortedBy === void 0 ? void 0 : sortedBy.startsWith("name"))
                ? sortedBy === "name-asc"
                    ? "asc"
                    : "desc"
                : undefined,
        },
        select: {
            name: true,
            description: true,
            circle: true,
            createdAt: true,
            createdBy: {
                select: utils_1.UserSelectMinimized,
            },
            liveLink: true,
            github: true,
            id: true,
        },
        take: limit ? parseInt(limit) : undefined,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Projects });
});
exports.getProjects = getProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Project = yield db_1.default.project.findUnique({
        where: {
            id: id,
        },
        select: {
            name: true,
            description: true,
            circle: true,
            createdAt: true,
            createdBy: {
                select: utils_1.UserSelectMinimized,
            },
            liveLink: true,
            github: true,
            id: true,
        },
    });
    if (!Project)
        throw new CustomError_1.default("Project not found.", http_status_codes_1.StatusCodes.NOT_FOUND);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Project });
});
exports.getProject = getProject;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, circleId, github, liveLink } = req.body;
    if (!name || !description)
        throw new CustomError_1.default("Name, and Description must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // Checks if the circle id the user provided is valid, and if the user has permission to create projects with the specified circle.
    if (circleId) {
        const circle = yield db_1.default.circle.findUnique({
            where: {
                id: isNaN(Number(circleId)) ? undefined : Number(circleId),
            },
            select: {
                members: true,
                colead: true,
                lead: true,
            },
        });
        if (!circle)
            throw new CustomError_1.default("Invalid circle provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        if (!((circle.colead && circle.colead.id === req.user.id) ||
            (circle.lead && circle.lead.id === req.user.id) ||
            circle.members.find((member) => member.id === req.user.id)))
            throw new CustomError_1.default("You're not a member of the circle provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const Project = yield db_1.default.project.create({
        data: {
            name,
            description,
            circleId: circleId ? Number(circleId) : undefined,
            createdById: req.user.id,
            github: github ? github : undefined,
            liveLink: liveLink ? liveLink : undefined,
        },
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Project });
});
exports.createProject = createProject;
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: "" });
});
exports.editProject = editProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Project = yield db_1.default.project.findUnique({
        where: { id },
    });
    if (!Project)
        throw new CustomError_1.default("Project not found.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (Project.createdById !== req.user.id)
        throw new CustomError_1.default("You do not have permission to delete this project.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    yield db_1.default.project.delete({ where: { id } });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
});
exports.deleteProject = deleteProject;
