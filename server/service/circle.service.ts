import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";
import prisma from "../model/db";
import {
	UserSelectClean,
	UserSelectFull,
	UserSelectMinimized,
	minimumCircleDescriptionLength,
} from "../utils";
import { Prisma } from "@prisma/client";
import { User } from "../types";

type CirclesServiceArgs = {
	query: {
		limit?: string;
		sortedBy?: string;
	};
};

type CreateCircleArgs = {
	body: {
		circle_num?: number;
		description?: string;
	};
};

type CircleRequestServiceArgs = {
	circleId: string;
	user: User;
};

type EditCircleArgs = {
	circleId: string;
	user: User;
	body: {
		description?: string;
		request?: {
			type: "ACCEPT" | "DECLINE";
			userId: string;
		};
		removeUser?: {
			userId: string;
		};
		manageUser?: {
			action: "PROMOTE" | "DEMOTE";
			userId: string;
		};
	};
};

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

export const CirclesService = async ({ query }: CirclesServiceArgs) => {
	const { limit = "10", sortedBy } = query;
	const sortedByValues = ["num-asc", "num-desc", "rating-asc", "rating-desc"];
	const maxLimit = 25;
	const minLimit = 1;

	if (isNaN(parseInt(limit)))
		throw new CustomError(
			"Invalid limit provided",
			StatusCodes.BAD_REQUEST
		);

	if (sortedBy && !sortedByValues.includes(sortedBy)) {
		// Checks if a valid sorting parameter has been provided.
		throw new CustomError(
			"Invalid sorting parameters",
			StatusCodes.BAD_REQUEST
		);
	}

	if (Number(limit) > maxLimit || Number(limit) < minLimit)
		throw new CustomError(
			`Invalid limit, must be between ${minLimit} and ${maxLimit}`,
			StatusCodes.BAD_REQUEST
		);

	const Circles = await prisma.circle.findMany({
		where: {},
		orderBy: {
			id: sortedBy?.startsWith("num")
				? sortedBy === "num-asc"
					? "asc"
					: "desc"
				: undefined,
			rating: sortedBy?.startsWith("rating")
				? sortedBy === "rating-asc"
					? "asc"
					: "desc"
				: undefined,
		},
		select: {
			id: true,
			description: true,
			rating: true,
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
			projects: {
				// TODO: Simplify this code to avoid repetition.
				select: {
					description: true,
					createdBy: true,
					createdAt: true,
					github: true,
					id: true,
					liveLink: true,
					name: true,
					pictures: true,
					pinned: true,
					circleId: true,
					circleVisibility: true,
					rating: true,
					tags: true,
				},
			},
			_count: true,
			createdAt: true,
		},
		take: limit ? parseInt(limit) : undefined,
	});

	return Circles;
};

export const getCircleService = async (id: string) => {
	const Circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(id)) ? undefined : Number(id),
		},
		select: {
			id: true,
			description: true,
			members: {
				select: UserSelectFull,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectFull,
			},
			colead: {
				select: UserSelectFull,
			},
			requests: {
				select: {
					id: true,
					first_name: true,
					last_name: true,
					profile_picture: true,
					projects: true,
					email: true,
				},
			},
			rating: true,
			projects: {
				select: {
					description: true,
					createdBy: true,
					createdAt: true,
					github: true,
					id: true,
					liveLink: true,
					name: true,
					pictures: true,
					pinned: true,
					circleId: true,
					circleVisibility: true,
					rating: true,
					tags: true,
				},
			},
			createdAt: true,
		},
	});

	if (!Circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	return Circle;
};

export const CreateCircleService = async ({ body }: CreateCircleArgs) => {
	const { circle_num: num, description } = body;
	// TODO: Option for adding circle lead, co-lead, and members when creating circle.

	if (!description)
		throw new CustomError(
			"Circle description must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (description.length <= minimumCircleDescriptionLength)
		throw new CustomError(
			`Description is too short, it must be at least ${minimumCircleDescriptionLength} characters`,
			StatusCodes.BAD_REQUEST
		);

	if (!num || isNaN(Number(num)))
		throw new CustomError(
			"Circle number must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (Number(num) < 0)
		throw new CustomError(
			"Circle number must be greater than zero.",
			StatusCodes.BAD_REQUEST
		);

	try {
		const Circle = await prisma.circle.create({
			data: {
				description: description,
				id: Number(num),
				// TODO: ability to add a lead, co lead when creating the user
			},
		});

		if (!Circle)
			throw new CustomError(
				"Error while trying to create circle",
				StatusCodes.INTERNAL_SERVER_ERROR
			);

		return Circle;
	} catch (error: any) {
		// Check if the error is being thrown by prisma, and it's about the num field already existing.
		if (error.code === "P2002" && error.meta?.target?.includes("id")) {
			throw new CustomError(
				"A circle with this number already exists.",
				StatusCodes.BAD_REQUEST
			);
		} else {
			throw new CustomError(
				error.message,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
};

export const RequestToJoinCircleService = async ({
	circleId,
	user,
}: CircleRequestServiceArgs) => {
	const { id: userId, first_name: userFirstName, role: userRole } = user;

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	if (
		(circle.lead && userId === circle.lead.id) ||
		(circle.colead && userId === circle.colead.id)
	)
		throw new CustomError(
			"You're already a member of this circle.",
			StatusCodes.BAD_REQUEST
		);

	// Checks if the user trying to join the circle is already a member of the circle.
	let memberExists = circle.members.some((member) => {
		return member.id === userId;
	});

	if (memberExists) {
		throw new CustomError(
			"You're already a member of this circle.",
			StatusCodes.BAD_REQUEST
		);
	}

	// Checks if the user trying to join the circle is already in the circle request list(list of user's who are trying to join the circle).
	let alreadyInRequestList = circle.requests.some((member) => {
		return member.id === userId;
	});

	if (alreadyInRequestList) {
		throw new CustomError(
			"You're already in the request list of this circle.",
			StatusCodes.BAD_REQUEST
		);
	}

	const notifications = [];

	if (circle.lead)
		notifications.push({
			content: `${userFirstName} has requested to join your circle.`,
			userId: circle.lead.id,
			url: "",
		});

	if (circle.colead)
		notifications.push({
			content: `${userFirstName} has requested to join your circle.`,
			userId: circle.colead.id,
			url: "",
		});

	const updatedCircle = await prisma.circle.update({
		where: { id: Number(circleId) },
		data: {
			requests: {
				connect: [{ id: userId }],
			},
		},
		include: {
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	return {
		circle: updatedCircle,
		notifications: notifications ? notifications : null,
	};
};

export const RemoveCircleRequestService = async ({
	circleId,
	user,
}: CircleRequestServiceArgs) => {
	const { id: userId } = user;

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	// Checks if the user trying to leave the circle is a member of the circle.
	let memberExists = circle.members.some((member) => {
		return member.id === userId;
	});

	if (memberExists) {
		throw new CustomError(
			"You're already a member of this circle.",
			StatusCodes.BAD_REQUEST
		);
	}

	// Checks if the user trying to join the circle is in the circle request list(A list of user's trying to join the circle) of the circle.
	let inCircleRequestList = circle.requests.some((member) => {
		return member.id === userId;
	});

	if (!inCircleRequestList) {
		throw new CustomError(
			"User is not in circle request list.",
			StatusCodes.BAD_REQUEST
		);
	}

	const updatedCircle = await prisma.circle.update({
		where: { id: Number(circleId) },
		data: {
			requests: {
				disconnect: [{ id: userId }],
			},
		},
		include: {
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	return updatedCircle;
};

export const LeaveCircleService = async ({
	circleId,
	user,
}: CircleRequestServiceArgs) => {
	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	const disconnectList:
		| Prisma.UserWhereUniqueInput
		| Prisma.UserWhereUniqueInput[] = [];
	const coleadDisconnect: Prisma.UserWhereUniqueInput = { id: undefined };

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	if (!circle.lead)
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);

	// Make sure it's not the circle lead.
	if (user.id === circle.lead.id)
		throw new CustomError(
			"You may not leave this circle.",
			StatusCodes.BAD_REQUEST
		);

	if (circle.colead && circle.colead.id === user.id) {
		// Remove the user from co-lead
		coleadDisconnect.id = user.id;
	} else if (circle.members.find((member) => member.id === user.id)) {
		// Remove the user from member list
		disconnectList.push({ id: user.id });
	} else
		throw new CustomError(
			"You are not a member of this circle.",
			StatusCodes.BAD_REQUEST
		);

	const updatedCircle = await prisma.circle.update({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		data: {
			members: {
				disconnect:
					disconnectList.length > 0 ? disconnectList : undefined,
			},
			colead: {
				disconnect: coleadDisconnect.id ? coleadDisconnect : undefined,
			},
		},
		select: {
			id: true,
			description: true,
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			colead: {
				select: UserSelectClean,
			},
			lead: {
				select: UserSelectClean,
			},
			projects: {
				select: {
					description: true,
					createdBy: true,
					createdAt: true,
					github: true,
					id: true,
					liveLink: true,
					name: true,
				},
			},
			createdAt: true,
		},
	});

	// Send notification to the circle members.

	const circleMembers = updatedCircle.members.map((member) => {
		return {
			userId: member.id,
			content: `${user.first_name} has left your circle.`,
		};
	});

	if (updatedCircle.colead)
		circleMembers.push({
			userId: updatedCircle.colead.id,
			content: `${user.first_name} has left your circle.`,
		});

	return {
		circle: updatedCircle,
		notifications: [
			{
				userId: circle.lead.id,
				content: `${user.first_name} has left your circle.`,
			},
			...circleMembers,
		],
	};
};

export const EditCircleService = async ({
	circleId,
	user,
	body,
}: EditCircleArgs) => {
	const { description, request, removeUser, manageUser } = body;
	const disconnectList:
		| Prisma.UserWhereUniqueInput
		| Prisma.UserWhereUniqueInput[] = [];
	const connectList:
		| Prisma.UserWhereUniqueInput
		| Prisma.UserWhereUniqueInput[] = [];
	const requestDisconnectList:
		| Prisma.UserWhereUniqueInput
		| Prisma.UserWhereUniqueInput[] = [];
	const leadConnect: Prisma.UserWhereUniqueInput = { id: undefined };
	const coleadConnect: Prisma.UserWhereUniqueInput = { id: undefined };
	const coleadDisconnect: Prisma.UserWhereUniqueInput = { id: undefined };
	const notificationList = [];

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
			requests: {
				select: UserSelectMinimized,
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	// If user is not an admin, and they can't modify other circles, they must be a circle lead or colead to modify this circle.
	if (!user.role.isAdmin && !user.role.canModifyOtherProject) {
		if (
			(circle.lead && circle.lead.id !== user.id) ||
			(circle.colead && circle.colead.id !== user.id)
		)
			throw new CustomError(
				"You do not have permission to perform this action.",
				StatusCodes.UNAUTHORIZED
			);
	}

	// if (!circle.lead)
	// 	throw new CustomError(
	// 		ReasonPhrases.INTERNAL_SERVER_ERROR,
	// 		StatusCodes.INTERNAL_SERVER_ERROR
	// 	);

	// if (
	// 	!(
	// 		req.user.id === circle.lead.id ||
	// 		(circle.colead && req.user.id === circle.colead.id)
	// 	)
	// )
	// 	throw new CustomError(
	// 		"You must be the circle lead or co-lead to manage this operation.",
	// 		StatusCodes.BAD_REQUEST
	// 	);

	if (request) {
		// Checks if the user exists in the circle request
		// If exists, add them to circle member, and remove them from request list.
		const userExistsInCircleRequest = circle.requests.find(
			(member) => member.id === request.userId
		);

		if (!userExistsInCircleRequest)
			throw new CustomError(
				"User has not requested to join the circle.",
				StatusCodes.BAD_REQUEST
			);
		if (request.type === "ACCEPT") {
			requestDisconnectList.push({ id: request.userId });
			connectList.push({ id: request.userId });

			// Send notification to the user that they've been accepted into the circle.
			notificationList.push({
				userId: request.userId,
				content: `You have been accepted into circle ${circleId}.`,
			});
		} else if (request.type === "DECLINE") {
			requestDisconnectList.push({ id: request.userId });
			// Send notification to the user that they've been declined to join the circle.
			notificationList.push({
				userId: request.userId,
				content: `Your request to join circle ${circleId} has been declined.`,
			});
		}
	}

	// Removing a user from the circle.
	if (removeUser) {
		// Checks if the user they are trying to remove exists as a member in their circle.
		// If exists, remove them from the circle member.

		if (circle.colead && circle.colead.id === removeUser.userId) {
			coleadDisconnect.id = removeUser.userId;
			// Send notification to the co-lead that they've been removed from the circle.
			notificationList.push({
				userId: removeUser.userId,
				content: `You have been kicked out of circle ${circleId}.`,
			});
		} else if (
			circle.members.find((member) => member.id === removeUser.userId)
		) {
			disconnectList.push({ id: removeUser.userId });
			// Send notification to the user that they've been removed from the circle.
			notificationList.push({
				userId: removeUser.userId,
				content: `You have been kicked out of circle ${circleId}.`,
			});
		} else
			throw new CustomError(
				"User is not a member of this circle.",
				StatusCodes.BAD_REQUEST
			);
	}

	if (description && !(description.length > minimumCircleDescriptionLength))
		throw new CustomError(
			`Description is too short, it must be at least ${minimumCircleDescriptionLength} characters`,
			StatusCodes.BAD_REQUEST
		);

	if (manageUser) {
		if (circle.lead && circle.lead.id === manageUser.userId)
			throw new CustomError(
				"You cannot perform this action on yourself.",
				StatusCodes.BAD_REQUEST
			);

		if (circle.colead && circle.colead.id === user.id)
			throw new CustomError(
				"You do not have the permission to perform this operation.",
				StatusCodes.BAD_REQUEST
			);

		// Checks if the user being managed is a colead, and if not, checks if the user is a member, and if not, an error gets thrown.
		if (circle.colead && circle.colead.id === manageUser.userId) {
			if (manageUser.action === "PROMOTE") {
				// Promotting a circle co-lead to lead.
				// 1. Makes the current circle lead a member
				// 2. Remove the circle co-lead, and make the current circle co-lead the circle lead.
				if (circle.lead) connectList.push({ id: circle.lead.id });
				coleadDisconnect.id = circle.colead.id;
				leadConnect.id = circle.colead.id;
				// Send notification to the co-lead becoming lead that they've been promoted.
				notificationList.push({
					userId: circle.colead.id,
					content: `You have been promoted to Circle-lead on Circle ${circleId}.`,
				});
			} else if (manageUser.action === "DEMOTE") {
				// Demotting a circle co-lead back to a member.
				coleadDisconnect.id = circle.colead.id;
				connectList.push({ id: circle.colead.id });
				// Send notification to the co-lead that they've been demoted.
				notificationList.push({
					userId: circle.colead.id,
					content: `You have been demoted from Circle Co-lead to Circle Member on Circle ${circleId}.`,
				});
			}
		} else if (
			circle.members.find((member) => member.id === manageUser.userId)
		) {
			// Does nothing when you try to demote a member.
			if (manageUser.action === "PROMOTE") {
				// 1. Remove the user from the member list
				// 2. If there's a co-lead already, make the co-lead a member
				// 3. Makes the member a circle co-lead
				coleadConnect.id = manageUser.userId;
				if (circle.colead) {
					connectList.push({ id: circle.colead.id });
					// Send notification to the current co-lead that they've been demoted.
					notificationList.push({
						userId: circle.colead.id,
						content: `You have been demoted from Circle Co-lead to Circle Member on Circle ${circleId}.`,
					});
				}
				disconnectList.push({ id: manageUser.userId });
				// Send notification to the member that they've been promoted.
				notificationList.push({
					userId: manageUser.userId,
					content: `You have been promoted from Circle Member to Circle Co-lead on Circle ${circleId}.`,
				});
			} else if (manageUser.action === "DEMOTE")
				throw new CustomError(
					"Circle member cannot be demoted further!",
					StatusCodes.BAD_REQUEST
				);
		} else
			throw new CustomError(
				"User does not exist as a circle member.",
				StatusCodes.BAD_REQUEST
			);
	}

	const Circle = await prisma.circle.update({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		data: {
			description:
				description &&
				description.length > minimumCircleDescriptionLength
					? description
					: undefined,
			members: {
				connect: connectList.length > 0 ? connectList : undefined,
				disconnect:
					disconnectList.length > 0 ? disconnectList : undefined,
			},
			requests: {
				disconnect:
					requestDisconnectList.length > 0
						? requestDisconnectList
						: undefined,
			},
			colead: {
				disconnect: coleadDisconnect.id ? coleadDisconnect : undefined,
				connect: coleadConnect.id ? coleadConnect : undefined,
			},
			lead: {
				connect: leadConnect.id ? leadConnect : undefined,
			},
		},
		select: {
			id: true,
			description: true,
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
			projects: {
				select: {
					description: true,
					createdBy: true,
					createdAt: true,
					github: true,
					id: true,
					liveLink: true,
					name: true,
				},
			},
			createdAt: true,
		},
	});

	return {
		circle: Circle,
		notifications: notificationList,
	};
};

export const DeleteCircleService = async ({
	circleId,
	user,
}: CircleRequestServiceArgs) => {
	const Circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		include: {
			lead: {
				select: UserSelectClean,
			},
			colead: {
				select: UserSelectClean,
			},
			members: {
				select: UserSelectClean,
			},
		},
	});

	if (!Circle)
		throw new CustomError("Circle does not exist.", StatusCodes.NOT_FOUND);

	// If the user is the circle lead, has permission to delete other circles or the user is an admin.
	if (
		(Circle.lead && Circle.lead.id === user.id) ||
		user.role.isAdmin ||
		user.role.canDeleteOtherCircles
	) {
		await prisma.circle.delete({
			where: {
				id: isNaN(Number(circleId)) ? undefined : Number(circleId),
			},
		});

		// Send notifications to the circle members, and co-lead.
		const circleMembers = Circle.members.map((member) => {
			return {
				userId: member.id,
				content: `Your circle, circle ${Circle.id} has been deleted.`,
			};
		});

		if (Circle.colead)
			circleMembers.push({
				userId: Circle.colead.id,
				content: `Your circle, circle ${Circle.id} has been deleted.`,
			});

		if (Circle.lead)
			circleMembers.push({
				userId: Circle.lead.id,
				content: `Your circle, circle ${Circle.id} has been deleted.`,
			});

		return {
			notifications: circleMembers,
		};
	} else
		throw new CustomError(
			"You are not allowed to delete this circle.",
			StatusCodes.BAD_REQUEST
		);
};
