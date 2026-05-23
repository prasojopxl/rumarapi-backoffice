import { prisma } from "../../lib/prisma";

export function findUserByUserName(userName: string) {
	return prisma.user.findUnique({
		where: {
			userName,
		}
	})
}

export function createUser(data: {
	fullName: string
	userName: string
	email: string
	roleId: string
	password: string
}) {
	return prisma.user.create({
		data,
	})
}

export function findUsers() {
	return prisma.user.findMany({
		select: {
			id: true,
			userName: true,
			fullName: true,
			email: true,
			createdAt: true,
			role: true,
			posts: true,
		}
	})
}

export function findUserById(id: string) {
	return prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			userName: true,
			fullName: true,
			email: true,
			roleId: true,
			role: true,
			createdAt: true,
			posts: true,
		}
	})
}

export function findUserProfileById(id: string) {
	return prisma.user.findUnique({
		where: {
			id,
		}
	})
}

export function updateUserProfile(id: string, data: { fullName: string, password: string }) {
	return prisma.user.update({
		where: {
			id,
		},
		data,
	})
}

export function updateUserById(id: string, data: {
	fullName: string
	userName: string
	email: string
	roleId: string
}) {
	return prisma.user.update({
		where: {
			id,
		},
		data,
	})
}

export function deleteUserById(id: string) {
	return prisma.user.delete({
		where: {
			id,
		}
	})
}
