import prisma from "../../model/db";
import { DEFAULT_ADMIN_ROLE_ID, DEFAULT_MEMBER_ROLE_ID } from "../../utils";

const CreateDefaultRoles = async () => {
	// Admin role
	await prisma.role.upsert({
		where: { id: DEFAULT_ADMIN_ROLE_ID },
		update: {},
		create: {
			id: DEFAULT_ADMIN_ROLE_ID,
			name: "Admin",
			isAdmin: true,
		},
	});

	// Member role
	await prisma.role.upsert({
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

	return 0;
};

export default CreateDefaultRoles;
