import { OrderStatus, Prisma } from "@prisma/client"
import { prisma } from "../../lib/prisma"

const orderInclude = {
    client: true,
    worker: true,
    items: {
        include: {
            product: true,
        },
    },
    histories: {
        include: {
            changedByUser: {
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    email: true,
                },
            },
        },
    },
} as const

type OrderItemInput = {
    productId: string
    quantity?: number
    discount?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
}

type OrderWriteInput = {
    clientId?: string
    workerId?: string | null
    status?: OrderStatus
    scheduledAt?: Date | null
    address?: string
    note?: string | null
    items?: OrderItemInput[]
}

function makeBookingCode() {
    return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function normalizeDate(value?: Date | string | null) {
    if (!value) {
        return undefined
    }

    return value instanceof Date ? value : new Date(value)
}

function toDecimal(value: number | string | Prisma.Decimal) {
    return value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value)
}

async function buildOrderItems(items: OrderItemInput[]) {
    const productIds = [...new Set(items.map((item) => item.productId))]
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    })

    if (products.length !== productIds.length) {
        throw new Error("One or more products were not found")
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    return items.map((item) => {
        const product = productMap.get(item.productId)
        if (!product) {
            throw new Error(`Product ${item.productId} was not found`)
        }

        const quantity = item.quantity ?? 1
        const discount = toDecimal(item.discount ?? 0)
        const price = toDecimal(product.price)
        const gross = price.mul(quantity)
        const totalPrice = gross.minus(discount)
        const normalizedTotalPrice = totalPrice.isNegative() ? new Prisma.Decimal(0) : totalPrice

        return {
            productId: product.id,
            productName: product.name,
            quantity,
            price,
            discount,
            totalPrice: normalizedTotalPrice,
            startTime: normalizeDate(item.startTime),
            endTime: normalizeDate(item.endTime),
        }
    })
}

export function findOrders() {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: orderInclude,
    })
}

export function findOrderById(id: string) {
    return prisma.order.findUnique({
        where: {
            id,
        },
        include: orderInclude,
    })
}

export async function createOrder(data: OrderWriteInput) {
    if (!data.clientId || !data.address || !data.items || data.items.length === 0) {
        throw new Error("Invalid order payload")
    }

    const items = await buildOrderItems(data.items)
    const subtotalAmount = items.reduce((sum, item) => sum.add(item.totalPrice), new Prisma.Decimal(0))
    const bookingCode = makeBookingCode()

    return prisma.order.create({
        data: {
            bookingCode,
            clientId: data.clientId,
            workerId: data.workerId || undefined,
            status: data.status || "DRAFT",
            scheduledAt: data.scheduledAt || undefined,
            address: data.address,
            note: data.note || undefined,
            items: {
                create: items,
            },
        },
        include: orderInclude,
    })
}

export async function updateOrderById(id: string, data: OrderWriteInput) {
    const existingOrder = await prisma.order.findUnique({ where: { id } })
    if (!existingOrder) {
        throw new Error("Order not found")
    }

    const items = data.items ? await buildOrderItems(data.items) : null

    return prisma.$transaction(async (tx) => {
        await tx.order.update({
            where: {
                id,
            },
            data: {
                clientId: data.clientId,
                workerId: data.workerId === "" ? null : data.workerId,
                scheduledAt: data.scheduledAt === null ? null : data.scheduledAt,
                address: data.address,
                note: data.note === null ? null : data.note,
            },
        })

        if (items) {
            await tx.orderItem.deleteMany({
                where: {
                    orderId: id,
                },
            })

            await tx.orderItem.createMany({
                data: items.map((item) => ({
                    ...item,
                    orderId: id,
                })),
            })
        }

        return tx.order.findUnique({
            where: {
                id,
            },
            include: orderInclude,
        })
    })
}

export function deleteOrderById(id: string) {
    return prisma.order.delete({
        where: {
            id,
        },
    })
}

export async function updateOrderStatusById(id: string, status: OrderStatus, changedByUserId: string, note?: string | null) {
    const existingOrder = await prisma.order.findUnique({
        where: {
            id,
        },
    })

    if (!existingOrder) {
        throw new Error("Order not found")
    }

    return prisma.$transaction(async (tx) => {
        await tx.orderStatusHistory.create({
            data: {
                orderId: id,
                fromStatus: existingOrder.status,
                toStatus: status,
                changedByUserId,
                note: note || undefined,
            },
        })

        return tx.order.update({
            where: {
                id,
            },
            data: {
                status,
            },
            include: orderInclude,
        })
    })
}
