import { StatusCodes } from "http-status-codes";
import prisma from "../model/db";
import { Req } from "../types";
import { Response } from "express";
import CustomError from "../middlewear/CustomError";

type sendNotificationData = {
	url?: string;
	content: string;
	userId: string;
};

type sendNotificationProps = {
	data: sendNotificationData | sendNotificationData[];
	many: boolean;
};

type updateNotificationProps = {
	id: string;
	status: "READ" | "UNREAD";
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
		});

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
			status: props.status,
		},
	});

	return notification;
};

export const getNotifications = async (req: Req, res: Response) => {
	const {
		user,
		query: { status },
	} = req;

	if (status !== undefined && status !== "READ" && status !== "UNREAD") {
		throw new CustomError(
			"Invalid notification status",
			StatusCodes.BAD_REQUEST
		);
	}
	const userNotifications = await prisma.notification.findMany({
		where: {
			userId: user.id,
			status: status ? status : undefined,
		},
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: userNotifications });
};

export const deleteNotification = async (req: Req, res: Response) => {};
