import { StatusCodes } from "http-status-codes";
import CustomError from "../middlewares/CustomError";
import prisma from "../model/db";
import {
	UserSelectClean,
	UserSelectMinimized,
	minimumCircleDescriptionLength,
} from "../utils";
import { User } from "../types";

type CirclesServiceArgs = {
	query: {
		limit?: string;
		sortedBy?: string;
		page?: string;
	};
};

type CreateCircleArgs = {
	body: {
		circle_num?: number;
		description?: string;
	};
	user: User;
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
	const { limit = "10", sortedBy, page = "1" } = query;
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
				select: {
					role: true,
					user: {
						select: UserSelectMinimized,
					},
				},
			},
			projects: {
				// TODO: Simplify this code to avoid repetition.
				select: {
					description: true,
					createdBy: {
						select: UserSelectClean,
					},
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
		skip: (parseInt(page) - 1) * parseInt(limit),
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
				select: {
					role: true,
					user: {
						select: UserSelectMinimized,
					},
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

export const CreateCircleService = async ({ body, user }: CreateCircleArgs) => {
	const { circle_num: num, description } = body;
	// TODO: Option for adding circle lead, co-lead, and members when creating circle.

	// Either the user role has the permission to create a circle or the user's role has isAdmin permission.
	if (!(user.role.canCreateCircle || user.role.isAdmin))
		throw new CustomError(
			"You do not have permission to create circles.",
			StatusCodes.UNAUTHORIZED
		);

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
				description: description as string,
				id: Number(circle_num),
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
	const { id: userId, role: userRole } = user;

	if (user.circle)
		throw new CustomError(
			"You're already a member of a circle, leave the circle before trying to join another circle.",
			StatusCodes.BAD_REQUEST
		);

	if (!(userRole.canJoinCircle || userRole.isAdmin))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	const userExists = circle.members.find(
		(member) => member.user.id === userId
	);

	// Checks if the user trying to join the circle is already a member of the circle.
	// Checks if the user trying to join the circle is already in the circle request list(list of user's who are trying to join the circle).
	if (userExists) {
		if (userExists.role === "PENDING")
			throw new CustomError(
				"You're already in the request list of this circle.",
				StatusCodes.BAD_REQUEST
			);
		else {
			throw new CustomError(
				"You're already a member of this circle.",
				StatusCodes.BAD_REQUEST
			);
		}
	}

	const notifications: { content: string; userId: string; url: string }[] =
		[];

	circle.members.forEach((member) => {
		if (member.role !== "PENDING") {
			notifications.push({
				content: `${
					user.first_name + " " + user.last_name
				} has requested to join your circle.`,
				userId: member.user.id,
				url: "",
			});
		}
	});

	const updatedCircle = await prisma.circle.update({
		where: { id: Number(circleId) },
		data: {
			members: {
				create: {
					role: "PENDING",
					userId,
				},
			},
		},
		include: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
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
	const { id: userId, role: userRole } = user;

	if (!userRole.isAdmin && !userRole.canLeaveCircle)
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.BAD_REQUEST
		);

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	const userExists = circle.members.find((member) => {
		return member.user.id === userId;
	});

	if (!userExists)
		throw new CustomError(
			"User is not in circle request list.",
			StatusCodes.BAD_REQUEST
		);

	if (userExists.role !== "PENDING")
		throw new CustomError(
			"User is already a member of the circle.",
			StatusCodes.BAD_REQUEST
		);

	// Checks if the user trying to leave the circle is a member of the circle.

	// Checks if the user trying to join the circle is in the circle request list(A list of user's trying to join the circle) of the circle.

	const updatedCircle = await prisma.circle.update({
		where: { id: Number(circleId) },
		data: {
			members: {
				delete: {
					userId,
					circleId: parseInt(circleId),
				},
			},
		},
		include: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	return updatedCircle;
};

export const LeaveCircleService = async ({
	circleId,
	user,
}: CircleRequestServiceArgs) => {
	const { role: userRole } = user;

	// User must have permission to leave a circle, or be an admin to be able to leave circle.
	if (!(userRole.canLeaveCircle || userRole.isAdmin))
		throw new CustomError(
			"You do not have permission to perform this action.",
			StatusCodes.UNAUTHORIZED
		);

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	const userDetails = circle.members.find(
		(member) => member.user.id === user.id
	);

	if (!userDetails)
		throw new CustomError(
			"User is not a member of this circle.",
			StatusCodes.BAD_REQUEST
		);

	const updatedCircle = await prisma.circle.update({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		data: {
			members: {
				delete: {
					userId: user.id,
					circleId: parseInt(circleId),
				},
			},
		},
		select: {
			id: true,
			description: true,
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
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

	// Send notification to the circle members.

	const notifications = updatedCircle.members.map((member) => {
		return {
			userId: member.user.id,
			content: `${
				user.first_name + " " + user.last_name
			} has left your circle.`,
		};
	});

	return {
		circle: updatedCircle,
		notifications,
	};
};

export const EditCircleService = async ({
	circleId,
	user,
	body,
}: EditCircleArgs) => {
	const { description, request, removeUser, manageUser } = body;
	const disconnectList: { circleId: number; userId: string }[] = [];
	const connectList: {
		userId: string;
		role: "LEADER" | "COLEADER" | "MEMBER" | "PENDING";
	}[] = [];
	const notificationList = [];
	const { role: userRole } = user;

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

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		select: {
			id: true,
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	const activeUser = circle.members.find(
		(member) => member.user.id === user.id
	);

	if (!activeUser)
		throw new CustomError(
			"User is not a member of circle.",
			StatusCodes.BAD_REQUEST
		);

	// If user is not an admin, and they can't modify other circles, they must be a circle lead or colead to modify this circle.
	if (!user.role.isAdmin && !user.role.canModifyOtherProject) {
		if (activeUser.role !== "LEADER" && activeUser.role !== "COLEADER")
			throw new CustomError(
				"You do not have permission to perform this action.",
				StatusCodes.UNAUTHORIZED
			);
	}

	if (request) {
		// Checks if the user exists in the circle request
		// If exists, add them to circle member, and remove them from request list.

		const userExistsInCircleRequest = circle.members.find(
			(member) => member.user.id === request.userId
		);

		if (!userExistsInCircleRequest)
			throw new CustomError(
				"User has not requested to join the circle.",
				StatusCodes.BAD_REQUEST
			);

		if (userExistsInCircleRequest.role !== "PENDING")
			throw new CustomError(
				"User is a member of this circle.",
				StatusCodes.BAD_REQUEST
			);

		if (request.type === "ACCEPT") {
			disconnectList.push({
				userId: request.userId,
				circleId: circle.id,
			});
			connectList.push({ userId: request.userId, role: "MEMBER" });

			// Send notification to the user that they've been accepted into the circle.
			notificationList.push({
				userId: request.userId,
				content: `You have been accepted into circle ${circleId}.`,
			});
		} else if (request.type === "DECLINE") {
			disconnectList.push({
				userId: request.userId,
				circleId: circle.id,
			});
			// Send notification to the user that they've been declined to join the circle.
			notificationList.push({
				userId: request.userId,
				content: `Your request to join circle ${circleId} has been declined.`,
			});
		} else
			throw new CustomError(
				"request.type must be either ACCEPT or DECLINE",
				StatusCodes.BAD_REQUEST
			);
	}

	// Removing a user from the circle.
	if (removeUser) {
		// Checks if the user they are trying to remove exists as a member in their circle.
		// If exists, remove them from the circle member.
		const userExists = circle.members.find(
			(member) => member.user.id === removeUser.userId
		);

		if (!userExists)
			throw new CustomError(
				"User is not a member of this circle.",
				StatusCodes.BAD_REQUEST
			);

		if (userExists.role === "LEADER" && !user.role.isAdmin)
			throw new CustomError(
				"You must be an administrator to perform this action.",
				StatusCodes.UNAUTHORIZED
			);

		disconnectList.push({ userId: removeUser.userId, circleId: circle.id });
		notificationList.push({
			userId: removeUser.userId,
			content: `You have been kicked out of circle ${circleId}.`,
		});
	}

	if (description && !(description.length > minimumCircleDescriptionLength))
		throw new CustomError(
			`Description is too short, it must be at least ${minimumCircleDescriptionLength} characters`,
			StatusCodes.BAD_REQUEST
		);

	if (manageUser) {
		if (manageUser.action !== "DEMOTE" && manageUser.action !== "PROMOTE")
			throw new CustomError(
				"Invalid manageUser.action provided.",
				StatusCodes.BAD_REQUEST
			);

		const userExists = circle.members.find(
			(member) => member.user.id === manageUser.userId
		);

		if (!userExists)
			throw new CustomError(
				"User is not a member of this circle.",
				StatusCodes.BAD_REQUEST
			);

		if (userExists.role === "LEADER" && !user.role.isAdmin)
			throw new CustomError(
				"You must be an administrator to perform this action.",
				StatusCodes.UNAUTHORIZED
			);

		if (userExists.role === "COLEADER" && user.id === manageUser.userId)
			throw new CustomError(
				"You cannot perform this action on yourself.",
				StatusCodes.BAD_REQUEST
			);

		const currColead = circle.members.find(
			(member) => member.role === "COLEADER"
		);
		const currLead = circle.members.find(
			(member) => member.role === "LEADER"
		);

		// Checks if the user being managed is a colead, and if not, checks if the user is a member, and if not, an error gets thrown.
		disconnectList.push({
			userId: userExists.user.id,
			circleId: circle.id,
		});

		if (manageUser.action === "PROMOTE") {
			if (userExists.role === "MEMBER") {
				connectList.push({
					role: "COLEADER",
					userId: userExists.user.id,
				});

				if (currColead) {
					disconnectList.push({
						userId: currColead.user.id,
						circleId: circle.id,
					});

					connectList.push({
						role: "MEMBER",
						userId: currColead.user.id,
					});
					notificationList.push({
						userId: currColead.user.id,
						content: `You have been demoted to circle Member on Circle ${circleId}.`,
					});
				}

				notificationList.push({
					userId: userExists.user.id,
					content: `You have been promoted to circle Co-Lead on Circle ${circleId}.`,
				});
			} else if (userExists.role === "COLEADER") {
				connectList.push({
					role: "LEADER",
					userId: userExists.user.id,
				});

				if (currLead) {
					connectList.push({
						role: "COLEADER",
						userId: currLead.user.id,
					});
					disconnectList.push({
						userId: currLead.user.id,
						circleId: circle.id,
					});
					notificationList.push({
						userId: currLead.user.id,
						content: `You have been demoted to circle Co-Lead on Circle ${circleId}.`,
					});
				}

				notificationList.push({
					userId: userExists.user.id,
					content: `You have been promoted to circle Lead on Circle ${circleId}.`,
				});
			} else {
				throw new CustomError(
					"You can not promote a circle lead",
					StatusCodes.BAD_REQUEST
				);
			}
		} else if (manageUser.action === "DEMOTE") {
			if (userExists.role === "COLEADER") {
				connectList.push({
					role: "MEMBER",
					userId: userExists.user.id,
				});

				notificationList.push({
					userId: userExists.user.id,
					content: `You have been demoted to circle Member on Circle ${circleId}.`,
				});
			} else if (userExists.role === "LEADER") {
				connectList.push({
					role: "COLEADER",
					userId: userExists.user.id,
				});

				if (currColead) {
					connectList.push({
						role: "LEADER",
						userId: currColead.user.id,
					});
					disconnectList.push({
						userId: currColead.user.id,
						circleId: circle.id,
					});

					notificationList.push({
						userId: currColead.user.id,
						content: `You have been promoted to circle Lead on Circle ${circleId}.`,
					});
				}

				notificationList.push({
					userId: userExists.user.id,
					content: `You have been demoted to circle Member on Circle ${circleId}.`,
				});
			} else {
				throw new CustomError(
					"You can not demote a circle member",
					StatusCodes.BAD_REQUEST
				);
			}
		}
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
				deleteMany:
					disconnectList.length > 0 ? disconnectList : undefined,
				create: connectList.length > 0 ? connectList : undefined,
			},
		},
		select: {
			id: true,
			description: true,
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							first_name: true,
						},
					},
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
	const { role: userRole } = user;

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

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		include: {
			members: {
				select: {
					role: true,
					user: {
						select: {
							id: true,
							role: true,
						},
					},
				},
			},
		},
	});

	if (!circle)
		throw new CustomError("Circle does not exist.", StatusCodes.NOT_FOUND);

	const activeUser = circle.members.find(
		(member) => member.user.id === user.id
	);

	if (!activeUser)
		throw new CustomError(
			"User is not a circle member.",
			StatusCodes.BAD_REQUEST
		);

	if (
		activeUser.role !== "LEADER" ||
		user.role.isAdmin ||
		user.role.canDeleteOtherCircles
	)
		throw new CustomError(
			"You are not allowed to delete this circle.",
			StatusCodes.BAD_REQUEST
		);
	// If the user is the circle lead, has permission to delete other circles or the user is an admin.

	await prisma.circle.delete({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
	});

	// Send notifications to the circle members, and co-lead.
	const notifications = circle.members.map((member) => {
		return {
			userId: member.user.id,
			content: `Your circle, circle ${circle.id} has been deleted.`,
		};
	});

	return {
		notifications,
	};
};
