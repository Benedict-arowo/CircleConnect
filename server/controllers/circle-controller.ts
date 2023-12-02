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
			num: sortedBy?.startsWith("num")
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
			num: true,
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
	res.status(StatusCodes.OK).json({ status: true, data: Circles });
};

export const getCircle = async (req: Req, res: Response) => {
	const { id } = req.params;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const Circle = await prisma.circle.findFirst({
		where: {
			OR: [
				{
					id: id,
				},
				{
					num: {
						equals: isNaN(Number(id)) ? undefined : Number(id),
					},
				},
			],
		},
		select: {
			id: true,
			description: true,
			num: true,
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

	if (!num)
		throw new CustomError(
			"Circle number must be provided.",
			StatusCodes.BAD_REQUEST
		);

	if (num < 0)
		throw new CustomError(
			"Circle number must be greater than zero.",
			StatusCodes.BAD_REQUEST
		);

	// TODO: Check if the user is already a member of another circle, and if so return an error otherwise continue.

	try {
		const Circle = await prisma.circle.create({
			data: {
				description: description,
				num,
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
		if (error.code === "P2002" && error.meta?.target?.includes("num")) {
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

type responseObj = {
	success: boolean;
	data?: Object;
};

export const editCircle = async (req: Req, res: Response) => {
	const { id } = req.params;
	const { addUser, removeUser } = req.query;
	const { description } = req.body;
	const responseObj: responseObj = { success: true };

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const circle = await prisma.circle.findUnique({
		where: { id },
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
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	if (!circle.lead)
		throw new CustomError(
			ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR
		);

	if (addUser === "true" && removeUser === "true")
		throw new CustomError(
			"You cannot add and remove yourself from a circle at the same time.",
			StatusCodes.BAD_REQUEST
		);

	if (addUser === "true" || removeUser === "true") {
		//* Makes sure the user making the request is not the circle lead trying to add or remove themselves from the circle member list.
		if (req.user.id === circle.lead.id || req.user.id === circle.lead.id)
			throw new CustomError(
				"You cannot add or remove a circle leader from the circle.",
				StatusCodes.BAD_REQUEST
			);

		if (addUser) {
			let memberExists = circle.members.some((member) => {
				return member.id === req.user.id;
			});
			if (memberExists) {
				throw new CustomError(
					"User is already a member of this circle.",
					StatusCodes.BAD_REQUEST
				);
			}
		}

		if (removeUser) {
			let memberExists = circle.members.some((member) => {
				return member.id === req.user.id;
			});

			if (!memberExists) {
				throw new CustomError(
					"User is not a member of this circle.",
					StatusCodes.BAD_REQUEST
				);
			}
		}
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

	const Circle = await prisma.circle.update({
		where: {
			id,
		},
		data: {
			description: !description ? undefined : description,
			members: {
				connect: addUser === "true" ? [{ id: req.user.id }] : undefined,
				disconnect:
					removeUser === "true" ? [{ id: req.user.id }] : undefined,
			},
		},
		select: {
			id: true,
			description: true,
			num: true,
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

	responseObj.data = Circle;

	res.status(StatusCodes.OK).json(responseObj);
};

export const deleteCircle = async (req: Req, res: Response) => {
	const { id: userId } = req.user;
	const { id: circleId } = req.params;

	const Circle = await prisma.circle.findUnique({
		where: { id: circleId },
		include: {
			members: {
				select: UserSelectMinimized,
				orderBy: {
					first_name: "desc",
				},
			},
		},
	});

	if (!Circle)
		throw new CustomError(
			"Circle does not exist.",
			StatusCodes.BAD_REQUEST
		);

	// if (member.id === userId && member.role === "LEAD") {
	// 	// Delete circle members first, then delete the circle because you can't delete the circle without first deleting the circle members. foreignKey...
	// 	await prisma.members.deleteMany({
	// 		where: {
	// 			circleId: Circle.id,
	// 		},
	// 	});

	// 	await prisma.circle.delete({
	// 		where: {
	// 			id: Circle.id,
	// 		},
	// 	});

	// 	res.status(StatusCodes.OK).json({
	// 		success: true,
	// 		message: "Circle deleted successfully.",
	// 	});
	// }

	throw new CustomError(
		"You are not allowed to delete this circle.",
		StatusCodes.BAD_REQUEST
	);
};
