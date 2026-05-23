import { prisma } from "../../lib/prisma";

export function findPosts() {
    return prisma.post.findMany({
        include: {
            author: true,
            featuredImage: true,
        },
    })
}

export function findPostById(id: string) {
    return prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
            featuredImage: true,
        },
    })
}

export function createPost(data: {
    authorId: string
    featuredImageId?: string
    title: string
    slug: string
    content: string
    type?: string
    status?: string
}) {
    return prisma.post.create({
        data,
    })
}

export function updatePostById(id: string, data: {
    authorId?: string
    featuredImageId?: string | null
    title?: string
    slug?: string
    content?: string
    type?: string
    status?: string
}) {
    return prisma.post.update({
        where: {
            id,
        },
        data,
    })
}

export function deletePostById(id: string) {
    return prisma.post.delete({
        where: {
            id,
        },
    })
}
