import prisma from "../model/db";
import { DEFAULT_ADMIN_ROLE_ID, DEFAULT_MEMBER_ROLE_ID } from "../utils";

const CreateDefaultRoles = async () => {
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

	return { memberRole, adminRole };
};

export default CreateDefaultRoles;
