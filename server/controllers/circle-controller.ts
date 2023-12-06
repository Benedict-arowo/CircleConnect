import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import {
	UserSelectFull,
	UserSelectMinimized,
	minimumCircleDescriptionLength,
} from "../utils";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";

export const getCircles = async (req: Req, res: Response) => {
	const { limit = "10", sortedBy } = req.query;
	const sortedByValues = ["num-asc", "num-desc", "rating-asc", "rating-desc"];

	if (isNaN(parseInt(limit)))
		throw new CustomError(
			"Invalid limit provided",
			StatusCodes.BAD_REQUEST
		);

	if (sortedBy && !sortedByValues.includes(sortedBy)) {
		throw new CustomError(
			"Invalid sorting parameters",
			StatusCodes.BAD_REQUEST
		);
	}

	if (Number(limit) > 25 || Number(limit) < 1)
		throw new CustomError(
			"Invalid limit, must be between 1 and 25",
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
			averageUserRating: sortedBy?.startsWith("rating")
				? sortedBy === "rating-asc"
					? "asc"
					: "desc"
				: undefined,
		},
		select: {
			id: true,
			description: true,
			visibility: true,
			averageUserRating: true,
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
			_count: true,
			createdAt: true,
		},
		take: limit ? parseInt(limit) : undefined,
	});

	res.status(StatusCodes.OK).json({ success: true, data: Circles });
};

export const getCircle = async (req: Req, res: Response) => {
	const { id } = req.params;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

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
			visibility: true,
			averageUserRating: true,
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

	if (!Circle)
		throw new CustomError("Circle not found.", StatusCodes.NOT_FOUND);

	res.status(StatusCodes.OK).json({ success: true, data: Circle });
};

export const createCircle = async (req: Req, res: Response) => {
	const { circle_num: num, description } = req.body;

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

	// TODO: Check if the user is already a member of another circle, and if so return an error otherwise continue.

	try {
		const Circle = await prisma.circle.create({
			data: {
				description: description,
				id: Number(num),
				lead: {
					connect: {
						id: req.user.id,
					},
				},
			},
		});

		if (!Circle)
			throw new CustomError(
				"Error while trying to create circle",
				StatusCodes.INTERNAL_SERVER_ERROR
			);

		res.status(StatusCodes.CREATED).json({ success: true, data: Circle });
	} catch (error: any) {
		// Check if the error is being thrown by prisma, and it's about the num field already existing.
		if (error.code === "P2002" && error.meta?.target?.includes("id")) {
			throw new CustomError(
				"A circle with this number already exists, try joining it.",
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

export const requestToJoinCircle = async (req: Req, res: Response) => {
	const {
		params: { id: circleId },
		user: { id: userId },
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

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

	if (!circle.lead)
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);

	if (userId === circle.lead.id || userId === circle.lead.id)
		throw new CustomError(
			"You're already a circle leader for this circle.",
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

	res.status(StatusCodes.OK).json({ success: true, data: updatedCircle });
};

export const removeCircleRequest = async (req: Req, res: Response) => {
	const {
		params: { id: circleId },
		user: { id: userId },
	} = req;

	if (!circleId)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

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

	if (!circle.lead)
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);

	if (userId === circle.lead.id || userId === circle.lead.id)
		throw new CustomError(
			"You may not leave this circle since you're the leader. Try deleting it instead.",
			StatusCodes.BAD_REQUEST
		);

	// Checks if the user trying to join the circle is a member of the circle.
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

	res.status(StatusCodes.OK).json({ success: true, data: updatedCircle });
};

export const editCircle = async (req: Req, res: Response) => {
	const { id } = req.params;
	const { leaveCircle } = req.query;
	const { description, request, removeUser } = req.body;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(id)) ? undefined : Number(id),
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

	if (!circle.lead)
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);

	if (request) {
		// Make sure the user is either the circle lead or co-lead.
		if (
			!(
				req.user.id === circle.lead.id ||
				(circle.colead && req.user.id === circle.colead.id)
			)
		)
			throw new CustomError(
				"You must be the circle lead or co-lead to perform this operation.",
				StatusCodes.BAD_REQUEST
			);

		// Checks if the user exists in the circle request
		// If exists, add them to circle member, and remove them from request list.
		const userExistsInCircleRequest = circle.requests.some(
			(member) => member.id === request.userId
		);
		if (!userExistsInCircleRequest)
			throw new CustomError(
				"User has not requested to join the circle.",
				StatusCodes.BAD_REQUEST
			);
	}

	if (leaveCircle === "true") {
		// Make sure it's not the circle lead.
		if (
			req.user.id === circle.lead.id ||
			(circle.colead && req.user.id === circle.colead.id)
		)
			throw new CustomError(
				"You may not leave this circle.",
				StatusCodes.BAD_REQUEST
			);

		const memberExists = circle.members.some(
			(member) => member.id === req.user.id
		);

		if (!memberExists) {
			const isColead = circle.colead && circle.colead.id === req.user.id;
			// Checks if the user is colead, and if so, it gets handled later in the memberDisconnectClause function. And if the user is not the colead, an error gets thrown.
			if (isColead) {
				return;
			} else
				throw new CustomError(
					"You are not a member of this circle.",
					StatusCodes.BAD_REQUEST
				);
		}
	}

	// Removing a user from the circle. (Circle lead, or colead only)
	if (removeUser) {
		// Checks if the user trying to perfrom the action has permission (lead or colead)
		if (
			!(
				req.user.id === circle.lead.id ||
				(circle.colead && req.user.id === circle.colead.id)
			)
		)
			throw new CustomError(
				"You must be the circle lead or co-lead to perform this operation.",
				StatusCodes.BAD_REQUEST
			);

		const memberExists = circle.members.some(
			(member) => member.id === removeUser.userId
		);

		// Checks if the user they are trying to remove exists as a member in their circle.
		// Removing the member is handled in the memberDisconnectClause function below.
		if (!memberExists)
			throw new CustomError(
				"User is not a member of this circle.",
				StatusCodes.BAD_REQUEST
			);
	}

	if (description && description.length <= minimumCircleDescriptionLength)
		throw new CustomError(
			`Description is too short, it must be at least ${minimumCircleDescriptionLength} characters`,
			StatusCodes.BAD_REQUEST
		);

	// If a description has been given, it checks that the user trying to change the description is either the circle lead or circle co-lead, and if not it throws an error.
	if (
		description &&
		!(
			circle.lead.id === req.user.id ||
			(circle.colead && circle.colead.id === req.user.id)
		)
	)
		throw new CustomError(
			"You do not have the permission to perform this action.",
			StatusCodes.BAD_REQUEST
		);

	let membersDisconnectClause = () => {
		let disconnectList = [];
		if (leaveCircle === "true") disconnectList.push({ id: req.user.id });
		if (request && request.type === "DECLINE")
			disconnectList.push({ id: request.userId });
		if (removeUser) disconnectList.push({ id: removeUser.userId });

		return disconnectList;
	};

	let requestDisconnectClause = () => {
		let disconnectList = [];
		if (request && request.type === "ACCEPT")
			disconnectList.push({ id: request.userId });
		if (request && request.type === "DECLINE")
			disconnectList.push({ id: request.userId });

		return disconnectList;
	};

	const Circle = await prisma.circle.update({
		where: {
			id: isNaN(Number(id)) ? undefined : Number(id),
		},
		data: {
			description: !description ? undefined : description,
			members: {
				connect:
					request && request.type === "ACCEPT"
						? [{ id: request.userId }]
						: undefined,
				disconnect:
					leaveCircle ||
					(request && request.type === "DECLINE") ||
					removeUser
						? membersDisconnectClause()
						: undefined,
			},
			requests: {
				disconnect: request ? requestDisconnectClause() : undefined,
			},
			colead: {
				disconnect:
					leaveCircle === "leaveCircleColead" && circle.colead
						? { id: circle.colead.id }
						: undefined,
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

	res.status(StatusCodes.OK).json({ success: true, data: Circle });
};

export const deleteCircle = async (req: Req, res: Response) => {
	const { id: userId } = req.user;
	const { id: circleId } = req.params;

	const Circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
		include: {
			lead: {
				select: UserSelectMinimized,
			},
			colead: {
				select: UserSelectMinimized,
			},
		},
	});

	if (!Circle)
		throw new CustomError(
			"Circle does not exist.",
			StatusCodes.BAD_REQUEST
		);

	if (Circle.lead && Circle.lead.id === userId) {
		await prisma.circle.delete({
			where: {
				id: isNaN(Number(circleId)) ? undefined : Number(circleId),
			},
		});
		res.status(StatusCodes.OK).json({ success: true });
	} else
		throw new CustomError(
			"You are not allowed to delete this circle.",
			StatusCodes.BAD_REQUEST
		);
};
