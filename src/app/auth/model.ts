import { prisma } from "../../lib/prisma";

export function findUserByUserName(userName: string) {
	return prisma.user.findUnique({
		where: {
			userName,
		},
	})
}
