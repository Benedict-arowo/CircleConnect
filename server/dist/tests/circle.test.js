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
const __1 = __importDefault(require(".."));
const db_1 = __importDefault(require("../model/db"));
const app = (0, __1.default)(db_1.default);
const request = require("supertest");
describe("Circle tests", () => {
    it("should get all circles without being logged in.", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/circle");
        const { status } = response.body;
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("status");
        expect(status).toBeTruthy();
    }));
    it("should get all circles while being logged", () => { });
    it("should get a specific circle without being logged in", () => { });
    it("should throw an erorr when trying to delete a circle without authentication", () => { });
    it("should throw an erorr when trying to delete a circle without having permission", () => { });
    it("should throw an erorr when trying to edit a circle without authentication", () => { });
    it("should throw an erorr when trying to edit a circle without having permission", () => { });
    it("should throw an error when trying to create a circle without permission", () => { });
    it("should throw an error when trying to create a circle without authentication", () => { });
    it("should successfully edit a circle", () => { });
    it("should successfully create a circle", () => { });
    it("should successfully delete a circle", () => { });
});
