import { User } from "@prisma/client";
import prisma from "./db";

type findUserProp = {
	select?: {};
	where: {
		id?: string;
		email: string;
	};
};

export const findUser = async ({ where, select }: findUserProp) => {
	const User = prisma.user.findUnique({
		where: {
			...where,
		},
	});

	return User;
};
