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
exports.deleteCircle = exports.editCircle = exports.createCircle = exports.getCircle = exports.getCircles = void 0;
const db_1 = __importDefault(require("../model/db"));
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = __importDefault(require("../middlewear/CustomError"));
const getCircles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = "10", sortedBy } = req.query;
    const sortedByValues = ["num-asc", "num-desc", "rating-asc", "rating-desc"];
    if (isNaN(parseInt(limit)))
        throw new CustomError_1.default("Invalid limit provided", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (sortedBy && !sortedByValues.includes(sortedBy)) {
        throw new CustomError_1.default("Invalid sorting parameters", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (Number(limit) > 25 || Number(limit) < 1)
        throw new CustomError_1.default("Invalid limit, must be between 1 and 25", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circles = yield db_1.default.circle.findMany({
        where: {},
        orderBy: {
            id: (sortedBy === null || sortedBy === void 0 ? void 0 : sortedBy.startsWith("num"))
                ? sortedBy === "num-asc"
                    ? "asc"
                    : "desc"
                : undefined,
            averageUserRating: (sortedBy === null || sortedBy === void 0 ? void 0 : sortedBy.startsWith("rating"))
                ? sortedBy === "rating-asc"
                    ? "asc"
                    : "desc"
                : undefined,
        },
        select: {
            id: true,
            description: true,
            visibility: true,
            averageUserRating: true,
            rating: true,
            members: {
                select: utils_1.UserSelectMinimized,
                orderBy: {
                    first_name: "desc",
                },
            },
            lead: {
                select: utils_1.UserSelectMinimized,
            },
            colead: {
                select: utils_1.UserSelectMinimized,
            },
            projects: {
                select: {
                    description: true,
                    createdBy: true,
                    createdAt: true,
                    github: true,
                    id: true,
                    liveLink: true,
                    name: true,
                },
            },
            _count: true,
            createdAt: true,
        },
        take: limit ? parseInt(limit) : undefined,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: true, data: Circles });
});
exports.getCircles = getCircles;
const getCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(id)) ? undefined : Number(id),
        },
        select: {
            id: true,
            description: true,
            members: {
                select: utils_1.UserSelectFull,
                orderBy: {
                    first_name: "desc",
                },
            },
            lead: {
                select: utils_1.UserSelectFull,
            },
            colead: {
                select: utils_1.UserSelectFull,
            },
            rating: true,
            visibility: true,
            averageUserRating: true,
            projects: {
                select: {
                    description: true,
                    createdBy: true,
                    createdAt: true,
                    github: true,
                    id: true,
                    liveLink: true,
                    name: true,
                },
            },
            createdAt: true,
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.NOT_FOUND);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Circle });
});
exports.getCircle = getCircle;
const createCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { circle_num: num, description } = req.body;
    if (!description)
        throw new CustomError_1.default("Circle description must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (description.length <= utils_1.minimumCircleDescriptionLength)
        throw new CustomError_1.default(`Description is too short, it must be at least ${utils_1.minimumCircleDescriptionLength} characters`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (!num)
        throw new CustomError_1.default("Circle number must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (num < 0)
        throw new CustomError_1.default("Circle number must be greater than zero.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // TODO: Check if the user is already a member of another circle, and if so return an error otherwise continue.
    try {
        const Circle = yield db_1.default.circle.create({
            data: {
                description: description,
                id: num,
                lead: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        if (!Circle)
            throw new CustomError_1.default("Error while trying to create circle", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, data: Circle });
    }
    catch (error) {
        // Check if the error is being thrown by prisma, and it's about the num field already existing.
        if (error.code === "P2002" && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("num"))) {
            throw new CustomError_1.default("A circle with this number already exists, try joining it.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        else {
            throw new CustomError_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
});
exports.createCircle = createCircle;
const editCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { addUser, removeUser } = req.query;
    const { description } = req.body;
    const responseObj = { success: true };
    if (!id)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(id)) ? undefined : Number(id),
        },
        select: {
            members: {
                select: utils_1.UserSelectMinimized,
                orderBy: {
                    first_name: "desc",
                },
            },
            lead: {
                select: utils_1.UserSelectMinimized,
            },
            colead: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    if (!circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (!circle.lead)
        throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    if (addUser === "true" && removeUser === "true")
        throw new CustomError_1.default("You cannot add and remove yourself from a circle at the same time.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (addUser === "true" || removeUser === "true") {
        //* Makes sure the user making the request is not the circle lead trying to add or remove themselves from the circle member list.
        if (req.user.id === circle.lead.id || req.user.id === circle.lead.id)
            throw new CustomError_1.default("You cannot add or remove a circle leader from the circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        if (addUser) {
            let memberExists = circle.members.some((member) => {
                return member.id === req.user.id;
            });
            if (memberExists) {
                throw new CustomError_1.default("User is already a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        if (removeUser) {
            let memberExists = circle.members.some((member) => {
                return member.id === req.user.id;
            });
            if (!memberExists) {
                throw new CustomError_1.default("User is not a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
    }
    if (description && description.length <= utils_1.minimumCircleDescriptionLength)
        throw new CustomError_1.default(`Description is too short, it must be at least ${utils_1.minimumCircleDescriptionLength} characters`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    // If a description has been given, it checks that the user trying to change the description is either the circle lead or circle co-lead, and if not it throws an error.
    if (description &&
        !(circle.lead.id === req.user.id ||
            (circle.colead && circle.colead.id === req.user.id)))
        throw new CustomError_1.default("You do not have the permission to perform this action.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circle = yield db_1.default.circle.update({
        where: {
            id: isNaN(Number(id)) ? undefined : Number(id),
        },
        data: {
            description: !description ? undefined : description,
            members: {
                connect: addUser === "true" ? [{ id: req.user.id }] : undefined,
                disconnect: removeUser === "true" ? [{ id: req.user.id }] : undefined,
            },
        },
        select: {
            id: true,
            description: true,
            members: {
                select: utils_1.UserSelectMinimized,
                orderBy: {
                    first_name: "desc",
                },
            },
            projects: {
                select: {
                    description: true,
                    createdBy: true,
                    createdAt: true,
                    github: true,
                    id: true,
                    liveLink: true,
                    name: true,
                },
            },
            createdAt: true,
        },
    });
    responseObj.data = Circle;
    res.status(http_status_codes_1.StatusCodes.OK).json(responseObj);
});
exports.editCircle = editCircle;
const deleteCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { id: circleId } = req.params;
    const Circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(circleId)) ? undefined : Number(circleId),
        },
        include: {
            members: {
                select: utils_1.UserSelectMinimized,
                orderBy: {
                    first_name: "desc",
                },
            },
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle does not exist.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // if (member.id === userId && member.role === "LEAD") {
    // 	// Delete circle members first, then delete the circle because you can't delete the circle without first deleting the circle members. foreignKey...
    // 	await prisma.members.deleteMany({
    // 		where: {
    // 			circleId: Circle.id,
    // 		},
    // 	});
    // 	await prisma.circle.delete({
    // 		where: {
    // 			id: Circle.id,
    // 		},
    // 	});
    // 	res.status(StatusCodes.OK).json({
    // 		success: true,
    // 		message: "Circle deleted successfully.",
    // 	});
    // }
    throw new CustomError_1.default("You are not allowed to delete this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
});
exports.deleteCircle = deleteCircle;
