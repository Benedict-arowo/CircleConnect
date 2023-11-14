// db.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

let prisma: PrismaClient;

if (process.env.USE_TEST_DB === "true") {
	console.log("dev");
	// Use mock database configuration for testing
	prisma = new PrismaClient({
		datasources: {
			db: {
				url: process.env.TEST_DATABASE_URL, // Use a file-based in-memory SQLite database
			},
		},
	});
} else {
	console.log("production");
	// Use real database configuration for production
	prisma = new PrismaClient();
}

export default prisma;
