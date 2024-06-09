import dotenv from "dotenv";
dotenv.config();
import makeApp from "./index";
import prisma from "./model/db";

const { app, server } = makeApp(prisma);
const port = process.env.PORT;

server.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
