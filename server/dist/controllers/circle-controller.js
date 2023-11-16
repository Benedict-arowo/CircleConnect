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
    const { circle_num: num } = req.query;
    const Circles = yield db_1.default.circle.findMany({
        where: {
            num: {
                equals: num ? parseInt(num) : undefined,
            },
        },
        select: {
            id: true,
            description: true,
            num: true,
            member: {
                select: {
                    id: true,
                    role: true,
                    user: {
                        select: utils_1.UserSelectMinimized,
                    },
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: true, data: Circles });
});
exports.getCircles = getCircles;
const getCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circle = yield db_1.default.circle.findFirst({
        where: {
            OR: [
                {
                    id: id,
                },
                {
                    num: {
                        equals: isNaN(parseInt(id)) ? undefined : parseInt(id),
                    },
                },
            ],
        },
        select: {
            id: true,
            description: true,
            num: true,
            member: {
                select: {
                    id: true,
                    role: true,
                    user: {
                        select: utils_1.UserSelectMinimized,
                    },
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Circle });
});
exports.getCircle = getCircle;
const createCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { circle_num: num, description } = req.body;
    if (!num)
        throw new CustomError_1.default("Circle number must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (num < 0)
        throw new CustomError_1.default("Circle number must be greater than zero.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    try {
        const Circle = yield db_1.default.circle.create({
            data: {
                description: description ? description : undefined,
                num,
            },
        });
        if (!Circle)
            throw new CustomError_1.default("Error while trying to create circle", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        // Add the current user as the circle lead.
        yield db_1.default.member.create({
            data: {
                circleId: Circle.id,
                userId: req.user.id,
                role: "LEAD",
            },
        });
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
    const { description } = req.body;
    if (!id)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    console.log(req.user);
    // TODO: Check if the user has permission to edit the circle
    const Circle = yield db_1.default.circle.update({
        where: {
            id,
        },
        data: {
            description,
        },
        select: {
            id: true,
            description: true,
            num: true,
            member: {
                select: {
                    id: true,
                    role: true,
                    user: {
                        select: utils_1.UserSelectMinimized,
                    },
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Circle });
});
exports.editCircle = editCircle;
const deleteCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { id: circleId } = req.params;
    const Circle = yield db_1.default.circle.findUnique({
        where: { id: circleId },
        include: {
            member: true,
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle does not exist.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // Loops through the circle members, and checks if the current user is the circle lead
    // TODO: implement permissions
    for (const member of Circle.member) {
        if (member.userId === userId && member.role === "LEAD") {
            // Delete circle members first, then delete the circle because you can't delete the circle without first deleting the circle members.
            yield db_1.default.member.deleteMany({
                where: {
                    circleId: Circle.id,
                },
            });
            yield db_1.default.circle.delete({
                where: {
                    id: Circle.id,
                },
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                success: true,
                message: "Circle deleted successfully.",
            });
        }
    }
    throw new CustomError_1.default("You are not allowed to delete this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
});
exports.deleteCircle = deleteCircle;
