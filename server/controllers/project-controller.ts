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

