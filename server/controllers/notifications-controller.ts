import { StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";
import { UserSelectClean } from "../utils";
import { Socket } from "socket.io";

type sendNotificationData = {
	url?: string;
	content: string;
	userId: string;
};

type sendNotificationProps = {
	data: sendNotificationData | sendNotificationData[];
	many: boolean;
	io: Socket;
};

type updateNotificationProps = {
	id: string;
	is_read: boolean;
};

export const sendNotification = async (props: sendNotificationProps) => {
	console.log(props.data);
	if (props.many) {
		const data = Array.isArray(props.data) ? props.data : [props.data];

		data.forEach(async (notification) => {
			const newNotification = await prisma.notification.create({
				data: {
					content: notification.content,
					userId: notification.userId,
					url: notification.url,
				},
				select: {
					content: true,
					createdAt: true,
					id: true,
					is_read: true,
					url: true,
					user: {
						select: UserSelectClean,
					},
				},
			});
			console.log("Sending multiple notifications");
			props.io
				.to(`user_${newNotification.user.id}`)
				.emit("notification", newNotification);
		});

		return 0;
	} else if ("content" in props.data && "userId" in props.data) {
		const newNotification = await prisma.notification.create({
			data: {
				content: props.data.content,
				userId: props.data.userId,
				url: props.data.url,
			},
			include: {
				user: {
					select: UserSelectClean,
				},
			},
		});

		console.log("Sending a single notification");
		props.io
			.to(`user_${props.data.userId}`)
			.emit("notification", newNotification);

		return 0;
	}
};

export const markAllAsRead = async (req: Req, res: Response) => {
	const notifications = await prisma.notification.updateMany({
		where: {
			userId: req.user.id,
			is_read: false,
		},
		data: {
			is_read: true,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: notifications });
};

export const markAsRead = async (req: Req, res: Response) => {
	const { id: notificationId } = req.params;

	const notification = await prisma.notification.findUnique({
		where: { id: notificationId },
	});

	if (!notification)
		throw new CustomError("Notification not found", StatusCodes.NOT_FOUND);

	if (notification.is_read)
		throw new CustomError(
			"Notification is already read.",
			StatusCodes.BAD_REQUEST
		);

	if (notification.userId !== req.user.id)
		throw new CustomError(
			"You do not have permission to modify this notification",
			StatusCodes.BAD_REQUEST
		);

	const updatedNotification = await prisma.notification.update({
		where: { id: notificationId },
		data: {
			is_read: true,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: updatedNotification });
};

export const markAsUnread = async (req: Req, res: Response) => {
	const { id: notificationId } = req.params;

	const notification = await prisma.notification.findUnique({
		where: { id: notificationId },
	});

	if (!notification)
		throw new CustomError("Notification not found", StatusCodes.NOT_FOUND);

	if (!notification.is_read)
		throw new CustomError(
			"Notification is already unread",
			StatusCodes.BAD_GATEWAY
		);

	if (notification.userId !== req.user.id)
		throw new CustomError(
			"You do not have permission to modify this notification",
			StatusCodes.BAD_REQUEST
		);

	const updatedNotification = await prisma.notification.update({
		where: { id: notificationId },
		data: {
			is_read: false,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: updatedNotification });
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

	// If the notification is marked as unread, mark it as read.
	if (!notification.is_read) {
		let updatedNotification = await prisma.notification.update({
			where: { id },
			data: {
				is_read: true,
			},
		});

		return res
			.status(StatusCodes.OK)
			.json({ status: true, data: updatedNotification });
	}

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
