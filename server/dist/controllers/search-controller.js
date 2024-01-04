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
exports.createOrUpdateSearch = exports.getSearches = void 0;
const db_1 = __importDefault(require("../model/db"));
const CustomError_1 = __importDefault(require("../middlewear/CustomError"));
const http_status_codes_1 = require("http-status-codes");
const getSearches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = "10", sortedBy } = req.query;
    const sortedByValues = ["count-asc", "count-desc"];
    if (isNaN(parseInt(limit)))
        throw new CustomError_1.default("Invalid limit provided", http_status_codes_1.StatusCodes.BAD_REQUEST);
    if (sortedBy && !sortedByValues.includes(sortedBy)) {
        throw new CustomError_1.default("Invalid sorting parameters", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (Number(limit) > 25 || Number(limit) < 1)
        throw new CustomError_1.default("Invalid limit, must be between 1 and 25", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const Searches = yield db_1.default.search.findMany({
        where: {},
        orderBy: {
            count: (sortedBy === null || sortedBy === void 0 ? void 0 : sortedBy.startsWith("count"))
                ? sortedBy === "count-asc"
                    ? "asc"
                    : "desc"
                : undefined,
        },
        take: limit ? parseInt(limit) : undefined,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: Searches });
});
exports.getSearches = getSearches;
const createOrUpdateSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.body;
    if (!search)
        throw ;
    yield db_1.default.search.upsert({
        where: {
            search,
        },
        create: {
            search,
        },
        update: {
            count: { increment: 1 },
        },
    });
    return 0;
});
exports.createOrUpdateSearch = createOrUpdateSearch;
