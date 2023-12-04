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
exports.editRating = exports.createRating = exports.getRatings = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = __importDefault(require("../model/db"));
const CustomError_1 = __importDefault(require("../middlewear/CustomError"));
const utils_1 = require("../utils");
const getRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { circleId, userId, limit = "10" } = req.query;
    if (Number(limit) > 25 || Number(limit) < 1)
        throw new CustomError_1.default("Invalid limit, must be between 1 and 25", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Ratings = yield db_1.default.circleRating.findMany({
        where: {
            circleId: isNaN(Number(circleId)) ? undefined : Number(circleId),
            userId: userId != null ? userId : undefined,
        },
        include: {
            circle: true,
            user: {
                select: utils_1.UserSelectMinimized,
            },
        },
        take: limit ? parseInt(limit) : undefined,
    });
    return res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: true, data: Ratings.length === 0 ? null : Ratings });
});
exports.getRatings = getRatings;
const createRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating = 0, circleId } = req.body;
    if (!circleId)
        throw new CustomError_1.default("circleId must be provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Circle = yield db_1.default.circle.findUnique({
        where: {
            id: isNaN(Number(circleId)) ? undefined : Number(circleId),
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle not found.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (typeof rating !== "number")
        throw new CustomError_1.default("Rating must be a number.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (rating < 0 || rating > 5)
        throw new CustomError_1.default("Rating must be between 0 and 5", http_status_codes_1.StatusCodes.BAD_REQUEST);
    try {
        const Rating = yield db_1.default.circleRating.create({
            data: {
                rating,
                // circleId: 1,
                circleId: isNaN(Number(circleId))
                    ? undefined
                    : Number(circleId),
                userId: req.user.id,
            },
            select: {
                id: true,
                rating: true,
                circle: true,
                user: true,
            },
        });
        calculateAverageRating(circleId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Rating });
    }
    catch (error) {
        if (error.code === "P2002" &&
            error.meta.target.includes("userId_circleId_unique")) {
            throw new CustomError_1.default("You have already rated this circle.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        else {
            console.log(error);
            throw new CustomError_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
});
exports.createRating = createRating;
const editRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating = 0 } = req.body;
    if (typeof rating !== "number")
        throw new CustomError_1.default("Rating must be a number.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (rating < 0 || rating > 5)
        throw new CustomError_1.default("Rating must be between 0 and 5", http_status_codes_1.StatusCodes.BAD_REQUEST);
    try {
        const Rating = yield db_1.default.circleRating.update({
            where: {
                id,
            },
            data: {
                rating,
            },
            select: {
                id: true,
                rating: true,
                circle: true,
                user: true,
            },
        });
        calculateAverageRating(Rating.circle.id);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Rating });
    }
    catch (error) {
        if (error.code === "P2025")
            throw new CustomError_1.default("Invalid ratingId provided.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        else
            throw new CustomError_1.default(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.editRating = editRating;
const calculateAverageRating = (circleId) => __awaiter(void 0, void 0, void 0, function* () {
    const Circle = yield db_1.default.circle.findUnique({
        where: { id: circleId },
        select: {
            rating: true,
        },
    });
    if (!Circle)
        throw new CustomError_1.default("Circle not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (Circle.rating.length === 0) {
        return 0;
    }
    const totalRating = Circle.rating.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / Circle.rating.length;
    yield db_1.default.circle.update({
        where: {
            id: circleId,
        },
        data: {
            averageUserRating: averageRating,
        },
    });
    return 0;
});
// export const deleteRating = async (req: Req, res: Response) => {
//     const rating = await prisma.circleRating.findUnique({
//         where: { id }
//     })
// 	return res.status(StatusCodes.OK).json({ page: "deleteRating" });
// };
