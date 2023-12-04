import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { Response } from "express";
import prisma from "../model/db";
import CustomError from "../middlewear/CustomError";
import { UserSelectMinimized } from "../utils";

// TODO: Have rating be calculated by the amount of ratings the circle projects have.

export const getRatings = async (req: Req, res: Response) => {
	const { circleId, userId, limit = "10" } = req.query;

	if (Number(limit) > 25 || Number(limit) < 1)
		throw new CustomError(
			"Invalid limit, must be between 1 and 25",
			StatusCodes.BAD_REQUEST
		);

	const Ratings = await prisma.circleRating.findMany({
		where: {
			circleId: isNaN(Number(circleId)) ? undefined : Number(circleId),
			userId: userId != null ? userId : undefined,
		},
		include: {
			circle: true,
			user: {
				select: UserSelectMinimized,
			},
		},
		take: limit ? parseInt(limit) : undefined,
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, data: Ratings.length === 0 ? null : Ratings });
};

export const createRating = async (req: Req, res: Response) => {
	const { rating = 0, circleId } = req.body;

	if (!circleId)
		throw new CustomError(
			"circleId must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const Circle = await prisma.circle.findUnique({
		where: {
			id: isNaN(Number(circleId)) ? undefined : Number(circleId),
		},
	});

	if (!Circle)
		throw new CustomError("Circle not found.", StatusCodes.BAD_REQUEST);

	if (typeof rating !== "number")
		throw new CustomError(
			"Rating must be a number.",
			StatusCodes.BAD_REQUEST
		);
	if (rating < 0 || rating > 5)
		throw new CustomError(
			"Rating must be between 0 and 5",
			StatusCodes.BAD_REQUEST
		);

	try {
		const Rating = await prisma.circleRating.create({
			data: {
				rating,
				// circleId: 1,
				circleId: isNaN(Number(circleId))
					? undefined
					: Number(circleId),
				userId: req.user.id,
			},
			select: {
				id: true,
				rating: true,
				circle: true,
				user: true,
			},
		});
		calculateAverageRating(circleId);
		return res.status(StatusCodes.OK).json({ success: true, data: Rating });
	} catch (error: any) {
		if (
			error.code === "P2002" &&
			error.meta.target.includes("userId_circleId_unique")
		) {
			throw new CustomError(
				"You have already rated this circle.",
				StatusCodes.BAD_REQUEST
			);
		} else {
			console.log(error);
			throw new CustomError(
				error.message,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
};

export const editRating = async (req: Req, res: Response) => {
	const { id } = req.params;
	const { rating = 0 } = req.body;

	if (typeof rating !== "number")
		throw new CustomError(
			"Rating must be a number.",
			StatusCodes.BAD_REQUEST
		);
	if (rating < 0 || rating > 5)
		throw new CustomError(
			"Rating must be between 0 and 5",
			StatusCodes.BAD_REQUEST
		);

	try {
		const Rating = await prisma.circleRating.update({
			where: {
				id,
			},
			data: {
				rating,
			},
			select: {
				id: true,
				rating: true,
				circle: true,
				user: true,
			},
		});
		calculateAverageRating(Rating.circle.id);

		return res.status(StatusCodes.OK).json({ success: true, data: Rating });
	} catch (error: any) {
		if (error.code === "P2025")
			throw new CustomError(
				"Invalid ratingId provided.",
				StatusCodes.BAD_REQUEST
			);
		else
			throw new CustomError(
				ReasonPhrases.INTERNAL_SERVER_ERROR,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
	}
};

const calculateAverageRating = async (circleId: string) => {
	const Circle = await prisma.circle.findUnique({
		where: { id: circleId },
		select: {
			rating: true,
		},
	});

	if (!Circle)
		throw new CustomError("Circle not found", StatusCodes.BAD_REQUEST);

	if (Circle.rating.length === 0) {
		return 0;
	}

	const totalRating = Circle.rating.reduce(
		(sum, rating) => sum + rating.rating,
		0
	);
	const averageRating = totalRating / Circle.rating.length;

	await prisma.circle.update({
		where: {
			id: circleId,
		},
		data: {
			averageUserRating: averageRating,
		},
	});

	return 0;
};

// export const deleteRating = async (req: Req, res: Response) => {

//     const rating = await prisma.circleRating.findUnique({
//         where: { id }
//     })
// 	return res.status(StatusCodes.OK).json({ page: "deleteRating" });
// };
