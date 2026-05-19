import { prisma } from "../../lib/prisma";

export function findBannerPositions() {
    return prisma.bannerPosition.findMany({
        include: {
            banners: true,
        },
    })
}

export function findBannerPositionById(id: string) {
    return prisma.bannerPosition.findUnique({
        where: {
            id,
        },
        include: {
            banners: true,
        },
    })
}

export function createBannerPosition(data: { name: string; slug: string; status?: string }) {
    return prisma.bannerPosition.create({
        data,
    })
}

export function updateBannerPositionById(id: string, data: { name?: string; slug?: string; status?: string }) {
    return prisma.bannerPosition.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteBannerPositionById(id: string) {
    return prisma.bannerPosition.delete({
        where: {
            id,
        },
    })
}
