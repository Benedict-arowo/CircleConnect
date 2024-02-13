import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import { StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";
import { sendNotification } from "./notifications-controller";
import {
	CirclesService,
	CreateCircleService,
	DeleteCircleService,
	EditCircleService,
	getCircleService,
	LeaveCircleService,
	RemoveCircleRequestService,
	RequestToJoinCircleService,
} from "../service/circle.service";

export const calAverageRating = async (id: number) => {
	const ratings = await prisma.projectRating.findMany({
		where: {
			project: {
				circleId: id,
			},
		},
		select: {
			rating: true,
		},
	});

	const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
	const averageRating = totalRating / ratings.length;

	await prisma.circle.update({
		where: { id },
		data: {
			rating: averageRating ? averageRating : 0,
		},
	});

	return averageRating;
};

export const getCircles = async (req: Req, res: Response) => {
	const Circles = await CirclesService({ query: req.query });
	res.status(StatusCodes.OK).json({ success: true, data: Circles });
};

export const getCircle = async (req: Req, res: Response) => {
	const { id } = req.params;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);
	const Circle = await getCircleService(id);
	res.status(StatusCodes.OK).json({ success: true, data: Circle });
};

export const createCircle = async (req: Req, res: Response) => {
	// Either the user role has the permission to create a circle or the user's role has isAdmin permission.
	if (!(req.user.role.canCreateCircle || req.user.role.isAdmin))
		throw new CustomError(
			"You do not have permission to create circles.",
			StatusCodes.UNAUTHORIZED
		);

	const createdCircle = await CreateCircleService({ body: req.body });

	res.status(StatusCodes.CREATED).json({
		success: true,
		data: createdCircle,
	});
};

export const requestToJoinCircle = async (req: Req, res: Response) => {
	const {
		params: { id: circleId },
		user: { role: userRole },
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (!userRole.canJoinCircle)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const { notifications, circle } = await RequestToJoinCircleService({
		circleId,
		user: req.user,
	});

	if (notifications)
		sendNotification({
			data: notifications,
			many: true,
			io: req.io,
		});

	res.status(StatusCodes.OK).json({ success: true, data: circle });
};

export const removeCircleRequest = async (req: Req, res: Response) => {
	const {
		params: { id: circleId },
		user: { role: userRole },
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (!userRole.canLeaveCircle)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.BAD_REQUEST
		);

	const circle = await RemoveCircleRequestService({
		circleId,
		user: req.user,
	});

	res.status(StatusCodes.OK).json({ success: true, data: circle });
};

export const leaveCircle = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { role: userRole },
	} = req;

	// User must have permission to leave a circle, or be an admin to be able to leave circle.
	if (!(userRole.canLeaveCircle || userRole.isAdmin))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const { notifications } = await LeaveCircleService({
		circleId: id,
		user: req.user,
	});

	sendNotification({
		data: notifications,
		many: true,
		io: req.io,
	});

	res.status(StatusCodes.OK).json({ success: true });
};

export const editCircle = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { role: userRole },
	} = req;

	if (
		!(
			userRole.canModifyOwnCircle ||
			userRole.canModifyOtherCircle ||
			userRole.isAdmin
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const { notifications, circle } = await EditCircleService({
		body: req.body,
		circleId: id,
		user: req.user,
	});

	if (notifications)
		// Sends all the notifications
		sendNotification({
			data: notifications,
			many: true,
			io: req.io,
		});

	res.status(StatusCodes.OK).json({ success: true, data: circle });
};

export const deleteCircle = async (req: Req, res: Response) => {
	const {
		params: { id },
		user: { id: userId, role: userRole },
	} = req;

	if (
		!(
			userRole.canDeleteOwnCircle ||
			userRole.canDeleteOtherCircles ||
			userRole.isAdmin
		)
	)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const { notifications } = await DeleteCircleService({
		circleId: id,
		user: req.user,
	});

	// Sends notifications if there's any.
	if (notifications)
		sendNotification({ data: notifications, many: true, io: req.io });

	res.status(StatusCodes.OK).json({ success: true });
};
