import { PrismaClient } from "@prisma/client";
import {
	ADMIN_USER_PASSWORD,
	DEFAULT_ADMIN_ROLE_ID,
	DEFAULT_MEMBER_ROLE_ID,
	DEFAULT_USER_PASSWORD,
	hash,
} from "../utils";
const prisma = new PrismaClient();

async function main() {
	const adminUserPassword = await hash(ADMIN_USER_PASSWORD);
	const defaultUserPassword = await hash(DEFAULT_USER_PASSWORD);

	const adminRole = await prisma.role.upsert({
		where: { id: DEFAULT_ADMIN_ROLE_ID },
		update: {},
		create: {
			id: DEFAULT_ADMIN_ROLE_ID,
			name: "Admin",
			isAdmin: true,
		},
	});

	const memberRole = await prisma.role.upsert({
		where: { id: DEFAULT_MEMBER_ROLE_ID },
		update: {},
		create: {
			id: DEFAULT_MEMBER_ROLE_ID,
			name: "Member",
			canDeleteOwnProject: true,
			canModifyOwnCircle: true,
			canModifyOwnProject: true,
			canCreateProject: true,
		},
	});

	const adminUser = await prisma.user.upsert({
		where: { email: "admin@circleconnect.com" },
		update: {},
		create: {
			email: "admin@circleconnect.com",
			first_name: "Admin",
			password: adminUserPassword,
			roleId: adminRole.id,
			track: "FRONTEND",
		},
	});

	const normalUser = await prisma.user.upsert({
		where: { email: "member@circleconnect.com" },
		update: {},
		create: {
			email: "member@circleconnect.com",
			first_name: "Member",
			password: defaultUserPassword,
			roleId: memberRole.id,
			track: "CLOUD",
		},
	});

	console.log({ adminUser, normalUser });
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
