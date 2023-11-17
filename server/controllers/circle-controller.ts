import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import { UserSelectMinimized } from "../utils";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../middlewear/CustomError";

export const getCircles = async (req: Req, res: Response) => {
	const { limit = "10", sortedBy } = req.query;
	const sortedByValues = ["num-asc", "num-desc"];

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
		},
		select: {
			id: true,
			description: true,
			num: true,
			member: {
				select: {
					id: true,
					role: true,
					user: {
						select: UserSelectMinimized,
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
						equals: isNaN(parseInt(id)) ? undefined : parseInt(id),
					},
				},
			],
		},
		select: {
			id: true,
			description: true,
			num: true,
			member: {
				select: {
					id: true,
					role: true,
					user: {
						select: UserSelectMinimized,
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

	res.status(StatusCodes.OK).json({ success: true, data: Circle });
};

export const createCircle = async (req: Req, res: Response) => {
	const { circle_num: num, description } = req.body;

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
				description: description ? description : undefined,
				num,
			},
		});

		if (!Circle)
			throw new CustomError(
				"Error while trying to create circle",
				StatusCodes.INTERNAL_SERVER_ERROR
			);

		// Add the current user as the circle lead.
		await prisma.member.create({
			data: {
				circleId: Circle.id,
				userId: req.user.id,
				role: "LEAD",
			},
		});

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

export const editCircle = async (req: Req, res: Response) => {
	const { id } = req.params;
	const { description } = req.body;

	if (!id)
		throw new CustomError(
			"An ID must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const circle = await prisma.circle.findUnique({
		where: { id },
		select: {
			member: true,
		},
	});

	if (!circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	circle.member.map((member) => {
		if (
			!(
				member.userId === req.user.id &&
				(member.role === "LEAD" || member.role === "COLEAD")
			)
		) {
			throw new CustomError(
				ReasonPhrases.UNAUTHORIZED,
				StatusCodes.UNAUTHORIZED
			);
		}
	});

	const Circle = await prisma.circle.update({
		where: {
			id,
		},
		data: {
			description,
		},
		select: {
			id: true,
			description: true,
			num: true,
			member: {
				select: {
					id: true,
					role: true,
					user: {
						select: UserSelectMinimized,
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

	res.status(StatusCodes.OK).json({ success: true, data: Circle });
};

export const deleteCircle = async (req: Req, res: Response) => {
	const { id: userId } = req.user;
	const { id: circleId } = req.params;

	const Circle = await prisma.circle.findUnique({
		where: { id: circleId },
		include: {
			member: true,
		},
	});

	if (!Circle)
		throw new CustomError(
			"Circle does not exist.",
			StatusCodes.BAD_REQUEST
		);

	for (const member of Circle.member) {
		if (member.userId === userId && member.role === "LEAD") {
			// Delete circle members first, then delete the circle because you can't delete the circle without first deleting the circle members. foreignKey...
			await prisma.member.deleteMany({
				where: {
					circleId: Circle.id,
				},
			});

			await prisma.circle.delete({
				where: {
					id: Circle.id,
				},
			});

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Circle deleted successfully.",
			});
		}
	}

	throw new CustomError(
		"You are not allowed to delete this circle.",
		StatusCodes.BAD_REQUEST
	);
};
