import { Socket } from "socket.io";
import { UserSelectClean } from "../utils";
import prisma from "../model/db";

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
