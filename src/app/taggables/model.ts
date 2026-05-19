import { prisma } from "../../lib/prisma";

export function findTaggables() {
    return prisma.taggable.findMany({
        include: {
            tag: true,
        },
    })
}

export function findTaggableById(id: string) {
    return prisma.taggable.findUnique({
        where: {
            id,
        },
        include: {
            tag: true,
        },
    })
}

export function createTaggable(data: { tagId: string; relatableId: string; relatableType: string }) {
    return prisma.taggable.create({
        data,
    })
}

export function updateTaggableById(id: string, data: { tagId?: string; relatableId?: string; relatableType?: string }) {
    return prisma.taggable.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteTaggableById(id: string) {
    return prisma.taggable.delete({
        where: {
            id,
        },
    })
}
