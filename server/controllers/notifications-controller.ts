import { StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import { UserSelectClean, UserSelectMinimized } from "../utils";

type sendNotificationData = {
	url?: string;
	content: string;
	userId: string;
};

type sendNotificationProps = {
	data: sendNotificationData | sendNotificationData[];
	many: boolean;
	io;
};

type updateNotificationProps = {
	id: string;
	is_read: boolean;
};

export const sendNotification = async (props: sendNotificationProps) => {
	if (props.many) {
		const data = Array.isArray(props.data) ? props.data : [props.data];

		const newNotifications = await prisma.notification.createMany({
			skipDuplicates: true,
			data: data.map((notificationData: sendNotificationData) => ({
				content: notificationData.content,
				userId: notificationData.userId,
				url: notificationData.url,
			})),
		});

		return newNotifications;
	} else if ("content" in props.data && "userId" in props.data) {
		const newNotification = await prisma.notification.create({
			data: {
				content: props.data.content,
				userId: props.data.userId,
				url: props.data.url,
			},
			include: {
				user: true,
			},
		});

		props.io
			.to(`user_${props.data.userId}`)
			.emit("notification", newNotification);

		return newNotification;
	}
};

export const updateNotificationStatus = async (
	props: updateNotificationProps
) => {
	const notification = await prisma.notification.update({
		where: {
			id: props.id,
		},
		data: {
			is_read: props.status,
		},
	});

	return notification;
};

export const getNotifications = async (req: Req, res: Response) => {
	const {
		user,
		query: { status },
	} = req;

	// await prisma.notification.create({
	// 	data: {
	// 		userId: "839e8515-e2f2-46e1-a1b6-b7641686cf75",
	// 		content: "Test notification",
	// 		url: "https://google.com",
	// 	},
	// });

	if (status !== undefined && status !== "true" && status !== "false") {
		throw new CustomError(
			"Invalid notification status",
			StatusCodes.BAD_REQUEST
		);
	}

	const userNotifications = await prisma.notification.findMany({
		where: {
			userId: user.id,
			is_read: status ? Boolean(status) : undefined,
		},
		select: {
			id: true,
			content: true,
			is_read: true,
			url: true,
			user: {
				select: UserSelectClean,
			},
			createdAt: true,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: userNotifications });
};

export const getNotification = async (req: Req, res: Response) => {
	const { id } = req.params;

	const notification = await prisma.notification.findUnique({
		where: { id },
		select: {
			id: true,
			content: true,
			is_read: true,
			url: true,
			user: {
				select: UserSelectClean,
			},
			createdAt: true,
		},
	});

	if (!notification)
		throw new CustomError("Notification not found.", StatusCodes.NOT_FOUND);

	if (notification.user.id !== req.user.id)
		throw new CustomError(
			"You're not allowed to view this notification.",
			StatusCodes.BAD_REQUEST
		);

	if (!notification.is_read)
		await prisma.notification.update({
			where: { id: notification.id },
			data: {
				is_read: true,
			},
		});

	return res
		.status(StatusCodes.OK)
		.json({ status: true, data: notification });
};

export const deleteNotification = async (req: Req, res: Response) => {
	const { id } = req.params;

	const notification = await prisma.notification.findUnique({
		where: { id },
	});

	if (!notification)
		throw new CustomError("Notification not found.", StatusCodes.NOT_FOUND);

	if (notification.userId !== req.user.id)
		throw new CustomError(
			"You do not have permission to delete this notification.",
			StatusCodes.BAD_REQUEST
		);

	await prisma.notification.delete({ where: { id } });
	return res.status(StatusCodes.OK).json({ success: true });
};
