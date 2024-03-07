import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewares/CustomError";
import { MAX_RATING_VALUE } from "../utils";
import {
	BodyUserArgs,
	CreateProjectService,
	DeleteProjectService,
	EditProjectService,
	GetProjectService,
	GetProjectsService,
	ManageProjectCircleService,
	RateProjectService,
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

	await DeleteProjectService({ user: req.user, id, body: {} });
	return res.status(StatusCodes.OK).json({ success: true });
};

export const rateProject = async (req: Req, res: Response) => {
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

	const newRating = await RateProjectService({ rating, id, user: req.user });

	return res.status(StatusCodes.CREATED).json({
		success: true,
		data: newRating,
	});
};

export const manageProjectCircle = async (req: Req, res: Response) => {
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

	const project = await ManageProjectCircleService({
		circleId,
		user: req.user,
		projectId,
	});

	return res.status(StatusCodes.OK).json({ success: true, data: project });
};
