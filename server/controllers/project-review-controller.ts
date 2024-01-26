import { Response } from "express";
import { Req } from "../types";
import prisma from "../model/db";
import CustomError from "../middlewear/CustomError";
import { StatusCodes } from "http-status-codes";
import { PrismaNotFoundErrorCode, UserSelectClean } from "../utils";

export const getReviews = async (req: Req, res: Response) => {
	const {
		params: { id: projectId },
	} = req;

	const project = await prisma.project.findUnique({
		where: {
			id: projectId,
		},
		select: {
			reviews: {
				select: {
					id: true,
					review: true,
					projectId: true,
					user: {
						select: UserSelectClean,
					},
				},
			},
		},
	});

	if (!project)
		throw new CustomError("Project not found", StatusCodes.NOT_FOUND);

	return res.json({ success: true, data: project }).status(StatusCodes.OK);
};

export const createReview = async (req: Req, res: Response) => {
	const {
		body: { content },
		params: { id: projectId },
	} = req;

	if (!content)
		throw new CustomError(
			"Content must be provided.",
			StatusCodes.BAD_REQUEST
		);

	const reviewExists = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!reviewExists)
		throw new CustomError("Project not found.", StatusCodes.NOT_FOUND);

	const review = await prisma.projectReview.create({
		data: {
			userId: req.user.id,
			projectId: projectId,
			review: content,
		},
	});

	res.json({ success: true, data: review }).status(StatusCodes.CREATED);
};

export const editReview = async (req: Req, res: Response) => {
	const {
		body: { content },
		params: { id: reviewId },
	} = req;

	if (!content)
		throw new CustomError(
			"Content must be provided.",
			StatusCodes.BAD_REQUEST
		);

	try {
		const review = await prisma.projectReview.update({
			where: { id: reviewId },
			data: {
				review: content,
			},
		});
		return res.json({ success: true, data: review });
	} catch (err: any) {
		// Prisma error code for not found
		if (err.code === PrismaNotFoundErrorCode)
			throw new CustomError("Review not found", StatusCodes.NOT_FOUND);
		else throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
	}
};
export const deleteReview = async (req: Req, res: Response) => {
	const {
		params: { id: reviewId },
	} = req;

	const review = await prisma.projectReview.findUnique({
		where: { id: reviewId },
	});

	if (!review)
		throw new CustomError("Review not found.", StatusCodes.NOT_FOUND);

	if (review.userId !== req.user.id)
		throw new CustomError(
			"You do not have permission to delete this review.",
			StatusCodes.BAD_REQUEST
		);

	await prisma.projectReview.delete({
		where: { id: reviewId },
	});

	res.json({ success: true }).status(StatusCodes.NO_CONTENT);
};
