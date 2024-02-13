import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import { MAX_RATING_VALUE, UserSelectMinimized } from "../utils";
import prisma from "../model/db";
import { calAverageRating } from "../service/circle.service";
import {
	BodyUserArgs,
	CreateProjectService,
	DeleteProjectService,
	EditProjectService,
	GetProjectService,
	GetProjectsService,
} from "../service/project.service";

export const getProjects = async (req: Req, res: Response) => {
	const projects = await GetProjectsService({ query: req.query });
	res.status(StatusCodes.OK).json({ success: true, data: projects });
};

export const getProject = async (req: Req, res: Response) => {
	const { id } = req.params;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const project = await GetProjectService(id);

	return res.status(StatusCodes.OK).json({ success: true, data: project });
};

export const createProject = async (req: Req, res: Response) => {
	const {
		user: { role: userRole },
	} = req;

	if (!(userRole.canCreateProject || userRole.isAdmin))
		throw new CustomError(
			"You do not have permission to perform this action",
			StatusCodes.UNAUTHORIZED
		);

	const project = await CreateProjectService({
		body: req.body as BodyUserArgs["body"],
		user: req.user,
	});

	return res.status(StatusCodes.OK).json({ success: true, data: project });
};

export const editProject = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { role: userRole, id: userId },
	} = req;

	// Either user is an admin, can modify other projects, or they can modify their own project. Checking if it's their own project is done below

	if (
		!(
			userRole.canModifyOwnProject ||
			userRole.canModifyOtherProject ||
			userRole.isAdmin
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const project = await EditProjectService({
		id,
		user: req.user,
		body: req.body as BodyUserArgs["body"],
	});

	return res.status(StatusCodes.OK).json({ success: true, data: project });
};

export const deleteProject = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { role: userRole },
	} = req;

	if (
		!(
			userRole.canDeleteOwnProject ||
			userRole.canDeleteOtherProject ||
			userRole.isAdmin
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	DeleteProjectService({ user: req.user, id, body: {} });
	return res.status(StatusCodes.OK).json({ success: true });
};

export const addRatingToProject = async (req: Req, res: Response) => {
	const {
		params: { id },
		body: { rating },
	} = req;

	if (!rating)
		throw new CustomError(
			"Rating must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (rating > MAX_RATING_VALUE)
		throw new CustomError("Invalid rating value.", StatusCodes.BAD_REQUEST);

	const project = await prisma.project.findUnique({
		where: {
			id,
		},
	});

	if (!project)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	if (req.user.id === project.createdById)
		throw new CustomError(
			"You can't rate your own project.",
			StatusCodes.BAD_REQUEST
		);

	const userRating = await prisma.projectRating.upsert({
		where: {
			userId_projectId: {
				projectId: id,
				userId: req.user.id,
			},
		},
		create: {
			projectId: id,
			userId: req.user.id,
			rating: rating,
		},
		update: {
			rating: rating,
		},
	});

	if (project.circleId) await calAverageRating(project.circleId);

	return res.status(StatusCodes.CREATED).json({
		success: true,
		data: userRating,
	});
};

export const addProjectToCircle = async (req: Req, res: Response) => {
	const {
		params: { id: projectId },
		body: { circleId },
		user: { role: userRole },
	} = req;

	if (circleId && !userRole.canAddProjectToCircle)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	if (!circleId && !userRole.canRemoveProjectFromCircle)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

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
				(Circle.lead && Circle.lead.id === req.user.id) ||
				(Circle.colead && Circle.colead.id === req.user.id) ||
				Circle.members.find((member) => member.id === req.user.id) ||
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

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: updatedProject });
};
