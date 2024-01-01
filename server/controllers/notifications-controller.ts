import prisma from "../model/db";

type sendNotificationData = {
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
			})),
		});

		return newNotifications;
	} else if ("content" in props.data && "userId" in props.data) {
		const newNotification = await prisma.notification.create({
			data: {
				content: props.data.content,
				userId: props.data.userId,
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
