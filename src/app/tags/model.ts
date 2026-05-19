import { prisma } from "../../lib/prisma";

export function findTags() {
    return prisma.tag.findMany({
        include: {
            taggables: true,
        },
    })
}

export function findTagById(id: string) {
    return prisma.tag.findUnique({
        where: {
            id,
        },
        include: {
            taggables: true,
        },
    })
}

export function createTag(data: { name: string; slug: string }) {
    return prisma.tag.create({
        data,
    })
}

export function updateTagById(id: string, data: { name?: string; slug?: string }) {
    return prisma.tag.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteTagById(id: string) {
    return prisma.tag.delete({
        where: {
            id,
        },
    })
}
