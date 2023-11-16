import makeApp from "..";
import prisma from "../model/db";
import { hash, tokenGenerator, verifyHash } from "../utils";
const request = require("supertest");

const app = makeApp(prisma);
const argon = require("argon2");
const jwt = require("jsonwebtoken");

jest.mock("../utils");
jest.mock("../utils", () => ({
	hash: jest.fn(async (input) => await argon.hash(input)),
	tokenGenerator: jest.fn(async (payload, expiresIn) => {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
	}),
	verifyHash: jest.fn(async (hashed, value) => {
		return await argon.verify(hashed, value);
	}),
}));

const userData = {
	email: "user@example.com",
	password: "userpass",
	first_name: "user",
	last_name: "user",
};

describe("Authentication tests", () => {
	describe("JWT authentication tests", () => {
		beforeEach(async () => {
			// 	await prisma.user.deleteMany({});
			jest.clearAllMocks();
		});

		afterAll(async () => {
			await prisma.$disconnect();
		});

		it("should throw an error when email and password aren't provided while logging in", async () => {
			const userBodyTestCases = [
				{ email: "user@example.com" },
				{ password: "usercom" },
				{},
			];

			for (const body of userBodyTestCases) {
				const response = await request(app)
					.post("/auth/jwt/login")
					.send(body)
					.set("Accept", "application/json");

				expect(response.statusCode).toBe(400);
				expect(response.body.success).toBe(false);
			}
		});

		it("should throw an error when email and password aren't provided while registering in", async () => {
			const userBodyTestCases = [
				{ email: "user@example.com" },
				{ password: "usercom" },
				{},
				{ email: "user@example.com", password: "usercom" },
				{ email: "user@example.com", first_name: "one" },
				{ email: "user@example.com", last_name: "two" },
			];

			for (const body of userBodyTestCases) {
				const response = await request(app)
					.post("/auth/jwt/login")
					.send(body)
					.set("Accept", "application/json");

				expect(response.statusCode).toBe(400);
				expect(response.body.success).toBe(false);
			}
		});

		it("should create a new user using JWT", async () => {
			await prisma.user.delete({
				where: { email: userData.email },
			});
			const response = await request(app)
				.post("/auth/jwt/register")
				.send({
					email: userData.email,
					password: userData.password,
					first_name: userData.first_name,
					last_name: userData.last_name,
				})
				.set("Accept", "application/json");

			// console.log(response.body);
			const { id: userId } = response.body.data;
			// Makes sure the user password isn't being sent back to the client.
			expect(response.body.data).not.toHaveProperty("password");

			// Expecting a userId to have been sent back from the user upon successful registration.
			expect(userId).toBeDefined();
			// Check if the password has been hashed.
			expect(hash).toHaveBeenCalledTimes(1);
			expect(hash).toHaveBeenCalledWith(userData.password);
			// Check if an access token has been generated
			expect(tokenGenerator).toHaveBeenCalledTimes(1);
			expect(tokenGenerator).toHaveBeenCalledWith({ id: userId }, "1h");
			expect(response.statusCode).toBe(201);

			// Check if the HTTP-only token is set in the cookies
			const jwtTokenCookie = response.headers["set-cookie"][0];
			const decodedCookie = decodeURIComponent(jwtTokenCookie);

			expect(decodedCookie).toMatch(
				/^\s*jwtToken=[^;]+; Path=\/; HttpOnly\s*$/
			);
		});

		it("should ensure that user successfully logs in using JWT", async () => {
			const localUserData = {
				email: "user1@example.com",
				password: "password",
				hashedPassword:
					"$argon2id$v=19$m=65536,t=3,p=4$nQqdSWxU8qf+9JX4DqMKzA$76u5NfsEerQ9VUKx7slVnhDiU/TdnIvzJQMUwi2EirQ",
				first_name: "user1",
				last_name: "user2",
			};

			await prisma.user.delete({
				where: {
					email: localUserData.email,
				},
			});

			// Creates a user
			await request(app)
				.post("/auth/jwt/register")
				.send({
					email: localUserData.email,
					password: localUserData.password,
					first_name: localUserData.first_name,
					last_name: localUserData.last_name,
				})
				.set("Accept", "application/json");

			// Tries to login
			const response = await request(app)
				.post("/auth/jwt/login")
				.send({
					email: localUserData.email,
					password: localUserData.password,
				})
				.set("Accept", "application/json");

			// console.log(response.body.data);
			const { id: userId } = response.body.data;
			expect(userId).toBeDefined();
			expect(verifyHash).toHaveBeenCalledTimes(1);
			expect(tokenGenerator).toHaveBeenCalledWith({ id: userId }, "1h");
			// Check if the HTTP-only token is set in the cookies
			const jwtTokenCookie = response.headers["set-cookie"][0];
			const decodedCookie = decodeURIComponent(jwtTokenCookie);

			expect(decodedCookie).toMatch(
				/^\s*jwtToken=[^;]+; Path=\/; HttpOnly\s*$/
			);

			expect(response.statusCode).toBe(200);
			expect(response.body.success).toBe(true);
		});

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
				.end(function (err: any, res: any) {
					if (err) return done(err);
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
		it("should redirect to google accounts page", async () => {
			// Use supertest to simulate an authentication request
			const response = await request(app).get("/auth/google");
			// console.log(response.body);
			// Check if the response is a redirect (Google OAuth login page)
			expect(response.status).toBe(302);
			expect(response.header.location).toContain("accounts.google.com");
			expect(response.header.location).toBeDefined();
		});
	});

	describe("Github authentication tests", () => {
		test("should redirect to github accounts page", async () => {
			// Use supertest to simulate an authentication request
			const response = await request(app).get("/auth/github");

			// Check if the response is a redirect (Google OAuth login page)
			expect(response.status).toBe(302);
			expect(response.header.location).toContain(
				"github.com/login/oauth"
			);
			expect(response.header.location).toBeDefined();
		});
	});
});
