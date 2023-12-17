import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import { UserSelectMinimized } from "../utils";
import prisma from "../model/db";

export const getProjects = async (req: Req, res: Response) => {
	const { limit = "10", sortedBy, userId, circleId, pinned } = req.query;
	const sortedByValues = [
		"circle_id-asc",
		"circle_id-desc",
		"name-asc",
		"name-desc",
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

	const Projects = await prisma.project.findMany({
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
			liveLink: true,
			github: true,
		},
		take: limit ? parseInt(limit) : undefined,
	});

	res.status(StatusCodes.OK).json({ success: true, data: Projects });
};

export const getProject = async (req: Req, res: Response) => {
	const { id } = req.params;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const Project = await prisma.project.findUnique({
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
			liveLink: true,
			github: true,
			id: true,
		},
	});

	if (!Project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	return res.status(StatusCodes.OK).json({ success: true, data: Project });
};

export const createProject = async (req: Req, res: Response) => {
	const {
		name,
		description,
		circleId,
		techUsed,
		github,
		liveLink,
		pictures,
	} = req.body;

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

	const Project = await prisma.project.create({
		data: {
			name,
			description,
			techUsed: techUsed ? techUsed : undefined,
			// circleId: circleId ? Number(circleId) : undefined,
			createdById: req.user.id,
			github: github ? github : undefined,
			liveLink: liveLink ? liveLink : undefined,
			pictures: pictures ? pictures : undefined,
		},
	});

	return res.status(StatusCodes.OK).json({ success: true, data: Project });
};

export const editProject = async (req: Req, res: Response) => {
	const {
		params: { id },
		body: {
			name,
			description,
			github,
			techUsed,
			liveLink,
			visibility,
			pictures,
			pinned,
		},
	} = req;

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
		},
	});

	if (visibility && !(visibility === "PUBLIC" || visibility === "PRIVATE"))
		throw new CustomError(
			"Invalid visibility value provided.",
			StatusCodes.BAD_REQUEST
		);

	if (!project)
		throw new CustomError("Project not found.", StatusCodes.BAD_REQUEST);

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
				(project.circle.lead &&
					project.circle.lead.id === req.user.id) ||
				(project.circle.colead &&
					project.circle.colead.id === req.user.id)
			)
		)
			throw new CustomError(
				"You do not have permission to pin/unpin this project.",
				StatusCodes.BAD_REQUEST
			);
	}

	if (techUsed) {
		if (!Array.isArray(techUsed))
			throw new CustomError(
				"techUsed must be an array.",
				StatusCodes.BAD_REQUEST
			);
		techUsed.forEach((tech) => {
			if (typeof tech !== "string")
				throw new CustomError(
					"Tech used must be an array of strings.",
					StatusCodes.BAD_REQUEST
				);
		});
	}

	const Project = await prisma.project.update({
		where: { id },
		data: {
			name: name ? name : undefined,
			description: description ? description : undefined,
			github: github !== undefined ? github : undefined,
			techUsed: techUsed ? techUsed : undefined,
			liveLink: liveLink !== undefined ? liveLink : undefined,
			circleVisibility: visibility ? visibility : undefined,
			pictures: pictures ? pictures : undefined,
			pinned: pinned !== undefined ? pinned : undefined,
			// circleId: circleId ? Number(circleId) : undefined,
		},
	});

	return res.status(StatusCodes.OK).json({ success: true, data: Project });
};

export const deleteProject = async (req: Req, res: Response) => {
	const { id } = req.params;
	const Project = await prisma.project.findUnique({
		where: { id },
	});

	if (!Project)
		throw new CustomError("Project not found.", StatusCodes.BAD_REQUEST);

	if (Project.createdById !== req.user.id)
		throw new CustomError(
			"You do not have permission to delete this project.",
			StatusCodes.BAD_REQUEST
		);

	await prisma.project.delete({ where: { id } });
	return res.status(StatusCodes.OK).json({ success: true });
};

export const addProjectToCircle = async (req: Req, res: Response) => {
	const {
		params: { id: projectId },
		body: { circleId },
	} = req;

	const Project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!Project)
		throw new CustomError(
			"Project with a matching ID not found",
			StatusCodes.NOT_FOUND
		);

	if (Number(circleId) !== 0) {
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
				(Circle.lead && Circle.lead.id === req.user.id) ||
				(Circle.colead && Circle.colead.id === req.user.id) ||
				Circle.members.find((member) => member.id === req.user.id)
			)
		)
			throw new CustomError(
				"You do not have permission to add this project to this circle.",
				StatusCodes.BAD_REQUEST
			);
	}

	if (!(req.user.id === Project.createdById))
		throw new CustomError(
			"You do not have permission to modify this project",
			StatusCodes.BAD_REQUEST
		);

	if (Project.circleId === Number(circleId))
		throw new CustomError(
			"The project is already in the circle provided.",
			StatusCodes.BAD_REQUEST
		);

	const updatedProject = await prisma.project.update({
		where: { id: projectId },
		data: {
			circleId: circleId ? Number(circleId) : null,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: updatedProject });
};

export const removeProjectFromCircle = async (req: Req, res: Response) => {
	const {
		params: { id: projectId },
		body: { circleId },
	} = req;

	if (!circleId)
		throw new CustomError(
			"Circle ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const Project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!Project)
		throw new CustomError(
			"Project with a matching ID not found",
			StatusCodes.NOT_FOUND
		);

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

	// if (!(req.user.id === Project.createdById))
	// 	throw new CustomError(
	// 		"You do not have permission to modify this project",
	// 		StatusCodes.BAD_REQUEST
	// 	);

	if (
		!(
			(Circle.lead && Circle.lead.id === req.user.id) ||
			(Circle.colead && Circle.colead.id === req.user.id) ||
			req.user.id === Project.createdById
		)
	)
		throw new CustomError(
			"You do not have permission to remove this project to from this circle.",
			StatusCodes.BAD_REQUEST
		);

	if (Project.circleId !== Number(circleId))
		throw new CustomError(
			"The project is not in the circle provided.",
			StatusCodes.BAD_REQUEST
		);

	const updatedProject = await prisma.project.update({
		where: { id: projectId },
		data: {
			circleId: null,
			pinned: false,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: updatedProject });
};
