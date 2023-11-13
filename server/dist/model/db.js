"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db.js
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let prisma;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
    console.log("dev");
    // Use mock database configuration for testing
    prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.TEST_DATABASE_URL, // Use a file-based in-memory SQLite database
            },
        },
    });
}
else {
    console.log("production");
    // Use real database configuration for production
    prisma = new client_1.PrismaClient();
}
exports.default = prisma;
