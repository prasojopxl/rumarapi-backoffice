import { prisma } from "../../lib/prisma";

export function findBanners() {
    return prisma.banner.findMany({
        include: {
            position: true,
            media: true,
        },
    })
}

export function findBannerById(id: string) {
    return prisma.banner.findUnique({
        where: {
            id,
        },
        include: {
            position: true,
            media: true,
        },
    })
}

export function createBanner(data: {
    positionId: string
    mediaId?: string
    title?: string
    subTitle?: string
    linkUrl?: string
    orderPriority?: number
    isActive?: boolean
    startDate?: Date
    endDate?: Date
}) {
    return prisma.banner.create({
        data,
    })
}

export function updateBannerById(id: string, data: {
    positionId?: string
    mediaId?: string | null
    title?: string
    subTitle?: string
    linkUrl?: string
    orderPriority?: number
    isActive?: boolean
    startDate?: Date | null
    endDate?: Date | null
}) {
    return prisma.banner.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteBannerById(id: string) {
    return prisma.banner.delete({
        where: {
            id,
        },
    })
}
