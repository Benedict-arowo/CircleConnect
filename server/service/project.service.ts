import { StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import CustomError from "../middlewear/CustomError";
import { UserSelectMinimized } from "../utils";
import { User } from "../types";
import { calAverageRating } from "./circle.service";

type GetProjectsService = {
	query: {
		circle_num?: string;
		id?: string;
		circle_id?: string;
		sortedBy?: string;
		limit?: string;
		circleId?: string;
		pinned?: string;
		userId?: string;
		status?: string;
		first_name?: string;
		last_name?: string;
		roleId?: string;
	};
};

export type BodyUserArgs = {
	id?: string;
	user: User;
	body: {
		name?: string;
		description?: string;
		circleId?: string;
		techUsed?: string;
		github?: string;
		liveLink?: string;
		pictures?: string;
		visibility?: string;
		pinned?: boolean;
	};
};

type ManageProjectCircleServiceArgs = {
	circleId?: string;
	projectId: string;
	user: User;
};

type RateProjectServiceArgs = {
	id: string;
	rating: number;
	user: User;
};

export const GetProjectsService = async ({ query }: GetProjectsService) => {
	const { limit = "10", sortedBy, userId, circleId, pinned } = query;

	const sortedByValues = [
		"circle_id-asc",
		"circle_id-desc",
		"name-asc",
		"name-desc",
		"rating-desc",
		"rating-asc",
	];

	if (isNaN(parseInt(limit)))
		throw new CustomError(
			"Invalid limit provided",
			StatusCodes.BAD_REQUEST
		);

	if (sortedBy && !sortedByValues.includes(sortedBy)) {
		throw new CustomError(
			"Invalid sorting parameters",
			StatusCodes.BAD_REQUEST
		);
	}

	if (Number(limit) > 25 || Number(limit) < 1)
		throw new CustomError(
			"Invalid limit, must be between 1 and 25",
			StatusCodes.BAD_REQUEST
		);

	const projects = await prisma.project.findMany({
		where: {
			OR:
				circleId || userId || pinned
					? [
							{
								circleId: circleId
									? !isNaN(Number(circleId))
										? Number(circleId)
										: undefined
									: undefined,
							},
							{
								createdById: userId ? userId : undefined,
							},
							{
								pinned: pinned ? true : undefined,
							},
					  ]
					: undefined,
		},
		orderBy: {
			circleId: sortedBy?.startsWith("circle_id")
				? sortedBy === "circle_id-asc"
					? "asc"
					: "desc"
				: undefined,
			name: sortedBy?.startsWith("name")
				? sortedBy === "name-asc"
					? "asc"
					: "desc"
				: undefined,
			rating: sortedBy?.startsWith("rating")
				? sortedBy === "rating-asc"
					? {
							_count: "asc",
					  }
					: {
							_count: "desc",
					  }
				: undefined,
		},
		select: {
			id: true,
			name: true,
			description: true,
			circle: true,
			createdAt: true,
			createdBy: {
				select: UserSelectMinimized,
			},
			rating: true,
			liveLink: true,
			github: true,
			techUsed: true,
		},
		take: limit ? parseInt(limit) : undefined,
	});

	return projects;
};

export const GetProjectService = async (id: string) => {
	const project = await prisma.project.findUnique({
		where: {
			id: id,
		},
		select: {
			name: true,
			description: true,
			circle: true,
			createdAt: true,
			createdBy: {
				select: UserSelectMinimized,
			},
			rating: true,
			liveLink: true,
			github: true,
			id: true,
			techUsed: true,
		},
	});

	if (!project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	return project;
};

export const CreateProjectService = async ({ body, user }: BodyUserArgs) => {
	const { name, description, techUsed, github, liveLink, pictures } = body;

	if (!name || !description)
		throw new CustomError(
			"Name, and Description must be provided.",
			StatusCodes.BAD_REQUEST
		);

	// // Checks if the circle id the user provided is valid, and if the user has permission to create projects with the specified circle.
	// if (circleId) {
	// 	const circle = await prisma.circle.findUnique({
	// 		where: {
	// 			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
	// 		},
	// 		select: {
	// 			members: true,
	// 			colead: true,
	// 			lead: true,
	// 		},
	// 	});

	// 	if (!circle)
	// 		throw new CustomError(
	// 			"Invalid circle provided.",
	// 			StatusCodes.BAD_REQUEST
	// 		);

	// 	if (
	// 		!(
	// 			(circle.colead && circle.colead.id === req.user.id) ||
	// 			(circle.lead && circle.lead.id === req.user.id) ||
	// 			circle.members.find((member) => member.id === req.user.id)
	// 		)
	// 	)
	// 		throw new CustomError(
	// 			"You're not a member of the circle provided.",
	// 			StatusCodes.BAD_REQUEST
	// 		);
	// }

	const project = await prisma.project.create({
		data: {
			name,
			description,
			techUsed: techUsed ? techUsed.split("|") : undefined,
			// circleId: circleId ? Number(circleId) : undefined,
			createdById: user.id,
			github: github ? github : undefined,
			liveLink: liveLink ? liveLink : undefined,
			pictures: pictures ? pictures.split("|") : undefined,
		},
	});

	return project;
};

export const EditProjectService = async ({ id, body, user }: BodyUserArgs) => {
	const {
		name,
		description,
		github,
		techUsed,
		liveLink,
		visibility,
		pictures,
		pinned,
	} = body;

	const project = await prisma.project.findUnique({
		where: { id },
		select: {
			circleId: true,
			circle: {
				select: {
					lead: true,
					colead: true,
				},
			},
			pinned: true,
			createdById: true,
		},
	});

	if (!project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	// If user is not an admin, and they can't modify other projects, then it means they have to be the owner of this project to be able to modify it.
	if (
		!(
			(!user.role.isAdmin || !user.role.canModifyOtherProject) &&
			project.createdById === user.id
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	if (visibility && !(visibility === "PUBLIC" || visibility === "PRIVATE"))
		throw new CustomError(
			"Invalid visibility value provided.",
			StatusCodes.BAD_REQUEST
		);

	if (pinned !== undefined && pinned !== false && pinned !== true)
		throw new CustomError(
			"Invalid pinned value provided.",
			StatusCodes.BAD_REQUEST
		);

	if (pinned !== undefined && project.circleId !== null) {
		if (!project.circle)
			throw new CustomError(
				"Circle not found.",
				StatusCodes.INTERNAL_SERVER_ERROR
			);

		if (pinned && project.pinned === true)
			throw new CustomError(
				"Project is already pinned.",
				StatusCodes.BAD_REQUEST
			);
		if (!pinned && project.pinned === false)
			throw new CustomError(
				"Project is not currently pinned.",
				StatusCodes.BAD_REQUEST
			);

		if (
			!(
				(project.circle.lead && project.circle.lead.id === user.id) ||
				(project.circle.colead && project.circle.colead.id === user.id)
			)
		)
			throw new CustomError(
				"You do not have permission to pin/unpin this project.",
				StatusCodes.BAD_REQUEST
			);
	}

	// if (techUsed) {
	// 	if (!Array.isArray(techUsed))
	// 		throw new CustomError(
	// 			"techUsed must be an array.",
	// 			StatusCodes.BAD_REQUEST
	// 		);
	// 	techUsed.forEach((tech) => {
	// 		if (typeof tech !== "string")
	// 			throw new CustomError(
	// 				"Tech used must be an array of strings.",
	// 				StatusCodes.BAD_REQUEST
	// 			);
	// 	});
	// }

	const updatedProject = await prisma.project.update({
		where: { id },
		data: {
			name: name ? name : undefined,
			description: description ? description : undefined,
			github: github !== undefined ? github : undefined,
			techUsed: techUsed ? techUsed.split("|") : undefined,
			liveLink: liveLink !== undefined ? liveLink : undefined,
			circleVisibility: visibility
				? (visibility as "PUBLIC" | "PRIVATE")
				: undefined,
			pictures: pictures ? pictures.split("|") : undefined,
			pinned: pinned !== undefined ? pinned : undefined,
			// circleId: circleId ? Number(circleId) : undefined,
		},
	});

	return updatedProject;
};

export const DeleteProjectService = async ({ id, user }: BodyUserArgs) => {
	const Project = await prisma.project.findUnique({
		where: { id },
	});

	if (!Project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	if (
		!(
			(!user.role.isAdmin || !user.role.canModifyOtherProject) &&
			Project.createdById === user.id
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	if (Project.createdById !== user.id)
		throw new CustomError(
			"You do not have permission to delete this project.",
			StatusCodes.BAD_REQUEST
		);

	await prisma.project.delete({ where: { id } });
	return 0;
};

export const ManageProjectCircleService = async ({
	circleId,
	projectId,
	user,
}: ManageProjectCircleServiceArgs) => {
	const { role: userRole } = user;

	const Project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!Project)
		throw new CustomError(
			"Project with a matching ID not found",
			StatusCodes.NOT_FOUND
		);

	if (circleId) {
		const Circle = await prisma.circle.findUnique({
			where: { id: Number(circleId) },
			select: {
				lead: true,
				colead: true,
				members: true,
			},
		});

		if (!Circle)
			throw new CustomError(
				"Circle with a matching ID not found",
				StatusCodes.NOT_FOUND
			);

		if (
			!(
				(Circle.lead && Circle.lead.id === user.id) ||
				(Circle.colead && Circle.colead.id === user.id) ||
				Circle.members.find((member) => member.id === user.id) ||
				userRole.isAdmin
			)
		)
			throw new CustomError(
				"You do not have permission to add this project to this circle.",
				StatusCodes.BAD_REQUEST
			);
	}

	// if (!(req.user.id === Project.createdById))
	// 	throw new CustomError(
	// 		"You do not have permission to modify this project",
	// 		StatusCodes.BAD_REQUEST
	// 	);

	if (circleId && Project.circleId === Number(circleId))
		throw new CustomError(
			"This project is already in the circle provided.",
			StatusCodes.BAD_REQUEST
		);
	else if (!circleId && !Project.circleId)
		throw new CustomError(
			"This project is not apart of any circle.",
			StatusCodes.BAD_REQUEST
		);

	const updatedProject = await prisma.project.update({
		where: { id: projectId },
		data: {
			circleId: circleId ? Number(circleId) : null,
		},
	});

	await calAverageRating(Number(circleId));

	return updatedProject;
};

export const RateProjectService = async ({
	id,
	rating,
	user,
}: RateProjectServiceArgs) => {
	const project = await prisma.project.findUnique({
		where: {
			id,
		},
	});

	if (!project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	if (user.id === project.createdById)
		throw new CustomError(
			"You can't rate your own project.",
			StatusCodes.BAD_REQUEST
		);

	const userRating = await prisma.projectRating.upsert({
		where: {
			userId_projectId: {
				projectId: id,
				userId: user.id,
			},
		},
		create: {
			projectId: id,
			userId: user.id,
			rating: rating,
		},
		update: {
			rating: rating,
		},
	});

	if (project.circleId) await calAverageRating(project.circleId);

	return userRating;
};
