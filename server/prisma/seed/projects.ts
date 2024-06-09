import prisma from "../../model/db";
import { DEFAULT_ADMIN_USER_EMAIL, DEFAULT_USER_EMAIL } from "../../utils";

const CreateDefaultProjects = async () => {
	const DEFAULT_USER = await prisma.user.findUnique({
		where: { email: DEFAULT_USER_EMAIL },
	});

	if (!DEFAULT_USER) return;

	// Project 1
	await prisma.project.upsert({
		where: {
			id: "66b6c559-53d3-4891-a92b-061e27aeb641",
		},
		create: {
			id: "66b6c559-53d3-4891-a92b-061e27aeb641",
			name: "CircleConnect",
			description:
				"A promising web app with the intension of bring the best out of people through collaboration.",
			createdBy: {
				connect: {
					email: DEFAULT_ADMIN_USER_EMAIL,
				},
			},
			github: "https://github.com/Benedict-arowo/CircleConnect",
			tags: [
				"Open Source",
				"MIT License",
				"TypeScript",
				"Postgres",
				"NodeJS",
			],
		},
		update: {},
	});

	// Project 2
	await prisma.project.upsert({
		where: {
			id: "1a845fa0-e377-4127-835c-cc0f713b8274",
		},
		create: {
			id: "1a845fa0-e377-4127-835c-cc0f713b8274",
			name: "Google Clone",
			description:
				"Nunc luctus sagittis accumsan. Fusce lacus odio, lacinia vitae velit non, egestas dapibus lacus. Donec libero nunc, cursus eget lectus et, suscipit laoreet ipsum. Mauris purus orci, sagittis at sem quis, rutrum vestibulum dui. ",
			createdBy: {
				connect: {
					email: DEFAULT_USER_EMAIL,
				},
			},
			circle: {
				connectOrCreate: {
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
				},
			},
			github: "https://github.com/Benedict-arowo/CircleConnect",
			tags: ["HTML", "CSS", "TAILWIND", "SASS"],
		},
		update: {},
	});

	// Project 3
	await prisma.project.upsert({
		where: {
			id: "028b0820-3134-4bc0-9e9b-d3786c44d672",
		},
		create: {
			id: "028b0820-3134-4bc0-9e9b-d3786c44d672",
			name: "Tiktok Clone",
			description:
				"Mauris ac augue mauris. Nunc elementum enim porta mauris commodo, id lacinia nisi accumsan. Praesent tellus erat, blandit non neque ac, blandit ultricies quam. Integer eget tortor non libero tempor sodales. ",
			createdBy: {
				connect: {
					email: DEFAULT_ADMIN_USER_EMAIL,
				},
			},
			circle: {
				connectOrCreate: {
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
				},
			},
			github: "https://github.com/Benedict-arowo/CircleConnect",
			tags: ["HTML", "Python", "NodeJS", "Cloudinary"],
		},
		update: {},
	});

	return 0;
};

export default CreateDefaultProjects;
