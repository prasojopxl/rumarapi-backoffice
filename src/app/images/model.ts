import { prisma } from "../../lib/prisma";

export function createImage(data: {
	filename: string
	filePath: string
	fileType: string
	fileSize: number
}) {
	return prisma.media.create({
		data,
	})
}

export function findImageById(id: string) {
	return prisma.media.findUnique({
		where: {
			id,
		},
	})
}

export function findImages() {
	return prisma.media.findMany()
}

