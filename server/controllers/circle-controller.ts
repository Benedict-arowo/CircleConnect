import { Response } from "express";
import { Req } from "../types";
import { StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";
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
import { sendNotification } from "../service/notification.service";

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
	const createdCircle = await CreateCircleService({
		body: req.body,
		user: req.user,
	});

	res.status(StatusCodes.CREATED).json({
		success: true,
		data: createdCircle,
	});
};

export const requestToJoinCircle = async (req: Req, res: Response) => {
	const {
		params: { id: circleId },
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
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
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
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
	} = req;

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
	} = req;

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
	} = req;

	const { notifications } = await DeleteCircleService({
		circleId: id,
		user: req.user,
	});

	// Sends notifications if there's any.
	if (notifications)
		sendNotification({ data: notifications, many: true, io: req.io });

	res.status(StatusCodes.OK).json({ success: true });
};
