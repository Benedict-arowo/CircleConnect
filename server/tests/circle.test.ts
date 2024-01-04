import makeApp from "..";
import prisma from "../model/db";

const app = makeApp(prisma);
const request = require("supertest");

describe("Circle tests", () => {
	it("should get all circles without being logged in.", async () => {
		const response = await request(app).get("/circle");
		const { status } = response.body;
		expect(response.body).toHaveProperty("data");
		expect(response.body).toHaveProperty("status");
		expect(status).toBeTruthy();
	});
	it("should get all circles while being logged", () => {});
	it("should get a specific circle without being logged in", () => {});
	it("should throw an erorr when trying to delete a circle without authentication", () => {});
	it("should throw an erorr when trying to delete a circle without having permission", () => {});
	it("should throw an erorr when trying to edit a circle without authentication", () => {});
	it("should throw an erorr when trying to edit a circle without having permission", () => {});
	it("should throw an error when trying to create a circle without permission", () => {});
	it("should throw an error when trying to create a circle without authentication", () => {});
	it("should successfully edit a circle", () => {});
	it("should successfully create a circle", () => {});
	it("should successfully delete a circle", () => {});
});
