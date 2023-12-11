import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import { UserSelectMinimized } from "../utils";
import prisma from "../model/db";

export const getProjects = async (req: Req, res: Response) => {
	const { limit = "10", sortedBy, userId, circleId } = req.query;
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

	console.log(
		circleId
			? !isNaN(Number(circleId))
				? Number(circleId)
				: undefined
			: undefined
	);
	const Projects = await prisma.project.findMany({
		where: {
			OR: circleId
				? [
						{
							circleId: circleId
								? !isNaN(Number(circleId))
									? Number(circleId)
									: undefined
								: undefined,
						},
						// {
						// 	createdById: userId ? userId : undefined,
						// },
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
	const { name, description, circleId, github, liveLink } = req.body;

	if (!name || !description)
		throw new CustomError(
			"Name, and Description must be provided.",
			StatusCodes.BAD_REQUEST
		);

	// Checks if the circle id the user provided is valid, and if the user has permission to create projects with the specified circle.
	if (circleId) {
		const circle = await prisma.circle.findUnique({
			where: {
				id: isNaN(Number(circleId)) ? undefined : Number(circleId),
			},
			select: {
				members: true,
				colead: true,
				lead: true,
			},
		});

		if (!circle)
			throw new CustomError(
				"Invalid circle provided.",
				StatusCodes.BAD_REQUEST
			);

		if (
			!(
				(circle.colead && circle.colead.id === req.user.id) ||
				(circle.lead && circle.lead.id === req.user.id) ||
				circle.members.find((member) => member.id === req.user.id)
			)
		)
			throw new CustomError(
				"You're not a member of the circle provided.",
				StatusCodes.BAD_REQUEST
			);
	}

	const Project = await prisma.project.create({
		data: {
			name,
			description,
			circleId: circleId ? Number(circleId) : undefined,
			createdById: req.user.id,
			github: github ? github : undefined,
			liveLink: liveLink ? liveLink : undefined,
		},
	});

	return res.status(StatusCodes.OK).json({ success: true, data: Project });
};

export const editProject = async (req: Req, res: Response) => {
	return res.status(StatusCodes.OK).json({ success: true, data: "" });
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