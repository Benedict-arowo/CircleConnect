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
const utils_1 = require("../utils");
const request = require("supertest");
const app = (0, __1.default)(db_1.default);
const argon = require("argon2");
const jwt = require("jsonwebtoken");
jest.mock("../utils");
jest.mock("../utils", () => ({
    hash: jest.fn((input) => __awaiter(void 0, void 0, void 0, function* () { return yield argon.hash(input); })),
    tokenGenerator: jest.fn((payload, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    })),
    verifyHash: jest.fn((hashed, value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield argon.verify(hashed, value);
    })),
}));
const userData = {
    email: "user@example.com",
    password: "userpass",
    first_name: "user",
    last_name: "user",
};
describe("Authentication tests", () => {
    describe("JWT authentication tests", () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.default.user.deleteMany({});
            jest.clearAllMocks();
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.default.$disconnect();
        }));
        it("should throw an error when email and password aren't provided while logging in", () => __awaiter(void 0, void 0, void 0, function* () {
            const userBodyTestCases = [
                { email: "user@example.com" },
                { password: "usercom" },
                {},
            ];
            for (const body of userBodyTestCases) {
                const response = yield request(app)
                    .post("/auth/jwt/login")
                    .send(body)
                    .set("Accept", "application/json");
                expect(response.statusCode).toBe(400);
                expect(response.body.success).toBe(false);
            }
        }));
        it("should throw an error when email and password aren't provided while registering in", () => __awaiter(void 0, void 0, void 0, function* () {
            const userBodyTestCases = [
                { email: "user@example.com" },
                { password: "usercom" },
                {},
                { email: "user@example.com", password: "usercom" },
                { email: "user@example.com", first_name: "one" },
                { email: "user@example.com", last_name: "two" },
            ];
            for (const body of userBodyTestCases) {
                const response = yield request(app)
                    .post("/auth/jwt/login")
                    .send(body)
                    .set("Accept", "application/json");
                expect(response.statusCode).toBe(400);
                expect(response.body.success).toBe(false);
            }
        }));
        it("should create a new user using JWT", () => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.default.user.deleteMany({});
            const response = yield request(app)
                .post("/auth/jwt/register")
                .send({
                email: userData.email,
                password: userData.password,
                first_name: userData.first_name,
                last_name: userData.last_name,
            })
                .set("Accept", "application/json");
            console.log(response.body);
            const { id: userId } = response.body.data;
            // Makes sure the user password isn't being sent back to the client.
            expect(response.body.data).not.toHaveProperty("password");
            // Expecting a userId to have been sent back from the user upon successful registration.
            expect(userId).toBeDefined();
            // Check if the password has been hashed.
            expect(utils_1.hash).toHaveBeenCalledTimes(1);
            expect(utils_1.hash).toHaveBeenCalledWith(userData.password);
            // Check if an access token has been generated
            expect(utils_1.tokenGenerator).toHaveBeenCalledTimes(1);
            expect(utils_1.tokenGenerator).toHaveBeenCalledWith({ id: userId }, "1h");
            expect(response.statusCode).toBe(201);
            // Check if the HTTP-only token is set in the cookies
            const jwtTokenCookie = response.headers["set-cookie"][0];
            const decodedCookie = decodeURIComponent(jwtTokenCookie);
            expect(decodedCookie).toMatch(/^\s*jwtToken=[^;]+; Path=\/; HttpOnly\s*$/);
        }));
        it("should ensure that user successfully logs in using JWT", () => __awaiter(void 0, void 0, void 0, function* () {
            const localUserData = {
                email: "user1@example.com",
                password: "password",
                first_name: "user1",
                last_name: "user2",
            };
            // Creates a user
            yield request(app)
                .post("/auth/jwt/register")
                .send({
                email: localUserData.email,
                password: localUserData.password,
                first_name: localUserData.first_name,
                last_name: localUserData.last_name,
            })
                .set("Accept", "application/json");
            const user = yield db_1.default.user.findUnique({
                where: { email: localUserData.email },
            });
            // Tries to login 
            const response = yield request(app)
                .post("/auth/jwt/login")
                .send({
                email: localUserData.email,
                password: localUserData.password,
            })
                .set("Accept", "application/json");
            const { id: userId } = response.body.data;
            expect(userId).toBeDefined();
            expect(utils_1.verifyHash).toHaveBeenCalledWith(user === null || user === void 0 ? void 0 : user.password, localUserData.password);
            expect(utils_1.verifyHash).toHaveBeenCalledTimes(1);
            expect(utils_1.tokenGenerator).toHaveBeenCalledWith({ id: userId }, "1h");
            // Check if the HTTP-only token is set in the cookies
            const jwtTokenCookie = response.headers["set-cookie"][0];
            const decodedCookie = decodeURIComponent(jwtTokenCookie);
            expect(decodedCookie).toMatch(/^\s*jwtToken=[^;]+; Path=\/; HttpOnly\s*$/);
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
        }));
        it("should give an error when trying to logout without being logged in", (done) => {
            const response = request(app)
                .get("/logout")
                .expect("Content-Type", /json/)
                .expect(() => {
                if (response.headers) {
                    // Ensure that the jwtToken cookie is not set when attempting to logout
                    expect(response.headers["set-cookie"]).toBeUndefined();
                }
            })
                .end(function (err, res) {
                if (err)
                    return done(err);
                return done();
            });
            // Ensure that the jwtToken cookie is not set when attempting to logout
            if (response.headers) {
                // Ensure that the jwtToken cookie is not set when attempting to logout
                expect(response.headers["set-cookie"]).toBeUndefined();
            }
        });
    });
    describe("Google authentication tests", () => {
        it('should redirect to google accounts page', () => __awaiter(void 0, void 0, void 0, function* () {
            // Use supertest to simulate an authentication request
            const response = yield request(app).get('/auth/google');
            console.log(response.body);
            // Check if the response is a redirect (Google OAuth login page)
            expect(response.status).toBe(302);
            expect(response.header.location).toContain('accounts.google.com');
            expect(response.header.location).toBeDefined();
        }));
    });
    describe("Github authentication tests", () => {
        test('should redirect to github accounts page', () => __awaiter(void 0, void 0, void 0, function* () {
            // Use supertest to simulate an authentication request
            const response = yield request(app).get('/auth/github');
            // Check if the response is a redirect (Google OAuth login page)
            expect(response.status).toBe(302);
            expect(response.header.location).toContain('github.com/login/oauth');
            expect(response.header.location).toBeDefined();
        }));
    });
});
