import { prisma } from "../../lib/prisma";

export function findCategories() {
    return prisma.category.findMany({
        include: {
            products: true,
        },
    })
}

export function findCategoryById(id: string) {
    return prisma.category.findUnique({
        where: {
            id,
        },
        include: {
            products: true,
        },
    })
}

export function createCategory(data: { name: string; slug: string; description?: string }) {
    return prisma.category.create({
        data,
    })
}

export function updateCategoryById(id: string, data: { name?: string; slug?: string; description?: string }) {
    return prisma.category.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteCategoryById(id: string) {
    return prisma.category.delete({
        where: {
            id,
        },
    })
}
