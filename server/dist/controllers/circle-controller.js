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
exports.deleteCircle = exports.editCircle = exports.leaveCircle = exports.removeCircleRequest = exports.requestToJoinCircle = exports.createCircle = exports.getCircle = exports.getCircles = void 0;
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
                    pictures: true,
                    pinned: true,
                    circleId: true,
                    circleVisibility: true,
                    rating: true,
                    techUsed: true,
                },
            },
            _count: true,
            createdAt: true,
        },
        take: limit ? parseInt(limit) : undefined,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Circles });
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
            requests: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    profile_picture: true,
                    projects: true,
                    email: true,
                },
            },
            rating: true,
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
                    pictures: true,
                    pinned: true,
                    circleId: true,
                    circleVisibility: true,
                    rating: true,
                    techUsed: true,
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
    if (!num || isNaN(Number(num)))
        throw new CustomError_1.default("Circle number must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (Number(num) < 0)
        throw new CustomError_1.default("Circle number must be greater than zero.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const userInfo = yield db_1.default.user.findUnique({
        where: { id: req.user.id },
        select: { leadOfId: true, coleadOfId: true, memberOfId: true },
    });
    if (!userInfo)
        throw new CustomError_1.default("User not found", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    // Checks if the user is already a member of another circle, and if so return an error otherwise continue.
    if (!(userInfo.leadOfId === null &&
        userInfo.coleadOfId === null &&
        userInfo.memberOfId === null))
        throw new CustomError_1.default("You must leave the circle you are currently in to create a new one.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    try {
        const Circle = yield db_1.default.circle.create({
            data: {
                description: description,
                id: Number(num),
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
        if (error.code === "P2002" && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("id"))) {
            throw new CustomError_1.default("A circle with this number already exists, try joining it.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        else {
            throw new CustomError_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
});
exports.createCircle = createCircle;
const requestToJoinCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: circleId }, user: { id: userId }, } = req;
    if (!circleId)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(circleId)) ? undefined : Number(circleId),
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
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    if (!circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (!circle.lead)
        throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    if (userId === circle.lead.id || userId === circle.lead.id)
        throw new CustomError_1.default("You're already a circle leader for this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // Checks if the user trying to join the circle is already a member of the circle.
    let memberExists = circle.members.some((member) => {
        return member.id === userId;
    });
    if (memberExists) {
        throw new CustomError_1.default("You're already a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Checks if the user trying to join the circle is already in the circle request list(list of user's who are trying to join the circle).
    let alreadyInRequestList = circle.requests.some((member) => {
        return member.id === userId;
    });
    if (alreadyInRequestList) {
        throw new CustomError_1.default("You're already in the request list of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const updatedCircle = yield db_1.default.circle.update({
        where: { id: Number(circleId) },
        data: {
            requests: {
                connect: [{ id: userId }],
            },
        },
        include: {
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: updatedCircle });
});
exports.requestToJoinCircle = requestToJoinCircle;
const removeCircleRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: circleId }, user: { id: userId }, } = req;
    if (!circleId)
        throw new CustomError_1.default("An ID must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(circleId)) ? undefined : Number(circleId),
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
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    if (!circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.NOT_FOUND);
    if (!circle.lead)
        throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    if (userId === circle.lead.id || userId === circle.lead.id)
        throw new CustomError_1.default("You may not leave this circle since you're the leader. Try deleting it instead.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    // Checks if the user trying to join the circle is a member of the circle.
    let memberExists = circle.members.some((member) => {
        return member.id === userId;
    });
    if (memberExists) {
        throw new CustomError_1.default("You're already a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Checks if the user trying to join the circle is in the circle request list(A list of user's trying to join the circle) of the circle.
    let inCircleRequestList = circle.requests.some((member) => {
        return member.id === userId;
    });
    if (!inCircleRequestList) {
        throw new CustomError_1.default("User is not in circle request list.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const updatedCircle = yield db_1.default.circle.update({
        where: { id: Number(circleId) },
        data: {
            requests: {
                disconnect: [{ id: userId }],
            },
        },
        include: {
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: updatedCircle });
});
exports.removeCircleRequest = removeCircleRequest;
const leaveCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
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
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    const disconnectList = [];
    const coleadDisconnect = { id: undefined };
    if (!circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (!circle.lead)
        throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    // Make sure it's not the circle lead.
    if (req.user.id === circle.lead.id)
        throw new CustomError_1.default("You may not leave this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (circle.colead && circle.colead.id === req.user.id) {
        // Remove the user from co-lead
        coleadDisconnect.id = req.user.id;
    }
    else if (circle.members.find((member) => member.id === req.user.id)) {
        // Remove the user from member list
        disconnectList.push({ id: req.user.id });
    }
    else
        throw new CustomError_1.default("You are not a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circle = yield db_1.default.circle.update({
        where: {
            id: isNaN(Number(id)) ? undefined : Number(id),
        },
        data: {
            members: {
                disconnect: disconnectList.length > 0 ? disconnectList : undefined,
            },
            colead: {
                disconnect: coleadDisconnect.id ? coleadDisconnect : undefined,
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
});
exports.leaveCircle = leaveCircle;
const editCircle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, request, removeUser, manageUser } = req.body;
    const disconnectList = [];
    const connectList = [];
    const requestDisconnectList = [];
    const leadConnect = { id: undefined };
    const coleadConnect = { id: undefined };
    const coleadDisconnect = { id: undefined };
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
            requests: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    if (!circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.NOT_FOUND);
    if (!circle.lead)
        throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    if (!(req.user.id === circle.lead.id ||
        (circle.colead && req.user.id === circle.colead.id)))
        throw new CustomError_1.default("You must be the circle lead or co-lead to manage this operation.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (request) {
        // Checks if the user exists in the circle request
        // If exists, add them to circle member, and remove them from request list.
        const userExistsInCircleRequest = circle.requests.find((member) => member.id === request.userId);
        if (!userExistsInCircleRequest)
            throw new CustomError_1.default("User has not requested to join the circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        if (request.type === "ACCEPT") {
            requestDisconnectList.push({ id: request.userId });
            connectList.push({ id: request.userId });
        }
        else if (request.type === "DECLINE") {
            requestDisconnectList.push({ id: request.userId });
        }
    }
    // Removing a user from the circle.
    if (removeUser) {
        // Checks if the user they are trying to remove exists as a member in their circle.
        // If exists, remove them from the circle member.
        if (circle.colead && circle.colead.id === removeUser.userId)
            coleadDisconnect.id = removeUser.userId;
        else if (circle.members.find((member) => member.id === removeUser.userId))
            disconnectList.push({ id: removeUser.userId });
        else
            throw new CustomError_1.default("User is not a member of this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (description && !(description.length > utils_1.minimumCircleDescriptionLength))
        throw new CustomError_1.default(`Description is too short, it must be at least ${utils_1.minimumCircleDescriptionLength} characters`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (manageUser) {
        if (circle.lead.id === manageUser.userId)
            throw new CustomError_1.default("You cannot perform this action on yourself.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        if (circle.colead && circle.colead.id === req.user.id)
            throw new CustomError_1.default("You do not have the permission to perform this operation.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        // Checks if the user being managed is a colead, and if not, checks if the user is a member, and if not, an error gets thrown.
        if (circle.colead && circle.colead.id === manageUser.userId) {
            if (manageUser.action === "PROMOTE") {
                // Promotting a circle co-lead to lead.
                // 1. Makes the current circle lead a member
                // 2. Remove the circle co-lead, and make the current circle co-lead the circle lead.
                connectList.push({ id: circle.lead.id });
                coleadDisconnect.id = circle.colead.id;
                leadConnect.id = circle.colead.id;
            }
            else if (manageUser.action === "DEMOTE") {
                // Demotting a circle co-lead back to a member.
                coleadDisconnect.id = circle.colead.id;
                connectList.push({ id: circle.colead.id });
            }
        }
        else if (circle.members.find((member) => member.id === manageUser.userId)) {
            // Does nothing when you try to demote a member.
            if (manageUser.action === "PROMOTE") {
                // 1. Remove the user from the member list
                // 2. Makes the member a circle co-lead
                coleadConnect.id = manageUser.userId;
                disconnectList.push({ id: manageUser.userId });
            }
            else if (manageUser.action === "DEMOTE")
                throw new CustomError_1.default("Circle member cannot be demoted further!", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        else
            throw new CustomError_1.default("User does not exist as a circle member.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const Circle = yield db_1.default.circle.update({
        where: {
            id: isNaN(Number(id)) ? undefined : Number(id),
        },
        data: {
            description: description &&
                description.length > utils_1.minimumCircleDescriptionLength
                ? description
                : undefined,
            members: {
                connect: connectList.length > 0 ? connectList : undefined,
                disconnect: disconnectList.length > 0 ? disconnectList : undefined,
            },
            requests: {
                disconnect: requestDisconnectList.length > 0
                    ? requestDisconnectList
                    : undefined,
            },
            colead: {
                disconnect: coleadDisconnect.id ? coleadDisconnect : undefined,
                connect: coleadConnect.id ? coleadConnect : undefined,
            },
            lead: {
                connect: leadConnect.id ? leadConnect : undefined,
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Circle });
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
            lead: {
                select: utils_1.UserSelectMinimized,
            },
            colead: {
                select: utils_1.UserSelectMinimized,
            },
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle does not exist.", http_status_codes_1.StatusCodes.NOT_FOUND);
    if (Circle.lead && Circle.lead.id === userId) {
        yield db_1.default.circle.delete({
            where: {
                id: isNaN(Number(circleId)) ? undefined : Number(circleId),
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
    }
    else
        throw new CustomError_1.default("You are not allowed to delete this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
});
exports.deleteCircle = deleteCircle;
