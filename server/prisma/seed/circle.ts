import prisma from "../../model/db";
import { DEFAULT_ADMIN_USER_EMAIL, DEFAULT_USER_EMAIL } from "../../utils";

const CreateDefaultCircles = async () => {
	// Circle 1
	await prisma.circle.upsert({
		where: { id: 1 },
		create: {
			id: 1,
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas leo tortor, sollicitudin sed lacus eget, accumsan dignissim erat. Curabitur ipsum nulla, porttitor non felis in, egestas luctus lorem. ",
			lead: {
				connect: {
					email: DEFAULT_USER_EMAIL,
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
			colead: {
				connect: {
					email: DEFAULT_ADMIN_USER_EMAIL,
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
