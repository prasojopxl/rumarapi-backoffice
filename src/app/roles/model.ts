import { prisma } from "../../lib/prisma";

export function findRoles() {
    return prisma.role.findMany({
        include: {
            users: true,
        },
    })
}

export function findRoleById(id: string) {
    return prisma.role.findUnique({
        where: {
            id,
        },
        include: {
            users: true,
        },
    })
}

export function createRole(data: { name: string }) {
    return prisma.role.create({
        data,
    })
}

export function updateRoleById(id: string, data: { name?: string }) {
    return prisma.role.update({
        where: {
            id,
        },
        data,
    })
}

export function deleteRoleById(id: string) {
    return prisma.role.delete({
        where: {
            id,
        },
    })
}
