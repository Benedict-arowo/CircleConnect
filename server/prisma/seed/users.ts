import prisma from "../../model/db";
import {
	ADMIN_USER_PASSWORD,
	DEFAULT_ADMIN_ROLE_ID,
	DEFAULT_ADMIN_USER_EMAIL,
	DEFAULT_MEMBER_ROLE_ID,
	DEFAULT_USER_EMAIL,
	DEFAULT_USER_PASSWORD,
	hash,
} from "../../utils";

const CreateDefaultUsers = async () => {
	const adminUserPassword = await hash(ADMIN_USER_PASSWORD);
	const defaultUserPassword = await hash(DEFAULT_USER_PASSWORD);

	// Admin user
	await prisma.user.upsert({
		where: { email: DEFAULT_ADMIN_USER_EMAIL },
		update: {},
		create: {
			email: DEFAULT_ADMIN_USER_EMAIL,
			first_name: "Admin",
			password: adminUserPassword,
			roleId: DEFAULT_ADMIN_ROLE_ID,
			track: "FRONTEND",
		},
	});

	// Normal user
	await prisma.user.upsert({
		where: { email: DEFAULT_USER_EMAIL },
		update: {},
		create: {
			email: DEFAULT_USER_EMAIL,
			first_name: "Member",
			password: defaultUserPassword,
			roleId: DEFAULT_MEMBER_ROLE_ID,
			track: "CLOUD",
		},
	});

	return 0;
};

export default CreateDefaultUsers;
