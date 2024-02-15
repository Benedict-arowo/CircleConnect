import { PrismaClient } from "@prisma/client";
import CreateDefaultRoles from "./seed/roles";
import CreateDefaultUsers from "./seed/users";
import CreateDefaultCircles from "./seed/circle";
import CreateDefaultProjects from "./seed/projects";
const prisma = new PrismaClient();

async function main() {
	await CreateDefaultRoles();
	await CreateDefaultUsers();
	await CreateDefaultCircles();
	await CreateDefaultProjects();
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
