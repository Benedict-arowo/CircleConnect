import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import makeApp from "./index";
import prisma from "./model/db";

dotenv.config();
const { app, server } = makeApp(prisma);
const port = process.env.PORT;

server.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
