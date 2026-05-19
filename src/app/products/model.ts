import { prisma } from "../../lib/prisma";

export function findProducts() {
    return prisma.product.findMany({
        include: {
            category: true,
            thumbnail: true,
        },
    })
}

export function findProductById(id: string) {
    return prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            thumbnail: true,
        },
    })
}

export function createProduct(data: {
    categoryId?: string
    thumbnailId?: string
    name: string
    slug: string
    description?: string
    price: number | string
    stock?: number
    status?: string
}) {
    return prisma.product.create({
        data,
    })
}

export function updateProductById(id: string, data: {
    categoryId?: string | null
    thumbnailId?: string | null
    name?: string
    slug?: string
    description?: string
    price?: number | string
    stock?: number
    status?: string
}) {
    return prisma.product.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteProductById(id: string) {
    return prisma.product.delete({
        where: {
            id,
        },
    })
}
