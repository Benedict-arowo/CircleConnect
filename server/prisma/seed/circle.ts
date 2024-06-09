import prisma from "../../model/db";
import { DEFAULT_ADMIN_USER_EMAIL, DEFAULT_USER_EMAIL } from "../../utils";

const CreateDefaultCircles = async () => {
	const DEFAULT_USER = await prisma.user.findUnique({
		where: { email: DEFAULT_USER_EMAIL },
	});

	const DEFAULT_ADMIN_USER = await prisma.user.findUnique({
		where: { email: DEFAULT_ADMIN_USER_EMAIL },
	});

	if (!DEFAULT_USER) return;
	if (!DEFAULT_ADMIN_USER) return;

	// Circle 1
	await prisma.circle.upsert({
		where: { id: 1 },
		create: {
			id: 1,
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas leo tortor, sollicitudin sed lacus eget, accumsan dignissim erat. Curabitur ipsum nulla, porttitor non felis in, egestas luctus lorem. ",
			members: {
				connectOrCreate: {
					where: {
						userId: DEFAULT_USER.id,
					},
					create: {
						role: "LEADER",
						userId: DEFAULT_USER.id,
					},
				},
			},
		},
		update: {},
	});

	// Circle 2
	await prisma.circle.upsert({
		where: { id: 2 },
		create: {
			id: 2,
			description:
				"Etiam pharetra, nisl a rutrum convallis, nulla elit pharetra sem, non malesuada erat mauris nec eros. Duis dignissim molestie tellus, id tristique lectus elementum vitae.",
			members: {
				connectOrCreate: {
					where: {
						userId: DEFAULT_ADMIN_USER.id,
					},
					create: {
						role: "LEADER",
						userId: DEFAULT_ADMIN_USER.id,
					},
				},
			},
		},
		update: {},
	});

	// Circle 3
	await prisma.circle.upsert({
		where: { id: 3 },
		create: {
			id: 3,
			description:
				"Nulla posuere felis eu aliquet iaculis. Donec iaculis eu ex eget cursus. Nulla sed erat at mauris mollis viverra. Maecenas id tortor vitae velit ullamcorper auctor eu ac leo. Sed nec justo scelerisque arcu porttitor efficitur quis vel erat. Ut tincidunt nisi malesuada est iaculis luctus.",
		},
		update: {},
	});

	return 0;
};

export default CreateDefaultCircles;
