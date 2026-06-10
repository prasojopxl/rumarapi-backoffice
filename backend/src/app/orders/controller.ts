import { Request, Response, NextFunction } from 'express';
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "./schema";
import { createOrder, deleteOrderById, findOrderById, findOrders, updateOrderById, updateOrderStatusById } from "./model";
import { OrderStatus } from "@prisma/client";

function normalizeStatus(value: string): OrderStatus {
    return value.toUpperCase() as OrderStatus
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await findOrders()
        res.json(orders)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch orders, ${error}`
        })
    }
}

export async function getOrderID(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await findOrderById(String(req.params.id))
        if (!order) {
            return res.status(404).send({
                message: "Order not found"
            })
        }
        res.json(order)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch order, ${error}`
        })
    }
}

export async function postOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createOrderSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const order = await createOrder({
            clientId: req.body.clientId,
            workerId: req.body.workerId || undefined,
            status: req.body.status ? normalizeStatus(req.body.status) : undefined,
            scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
            address: req.body.address,
            note: req.body.note,
            items: req.body.items,
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create order, ${error}`
        })
    }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateOrderSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkOrder = await findOrderById(String(req.params.id))
        if (!checkOrder) {
            return res.status(404).send({
                message: "Order not found"
            })
        }

        const order = await updateOrderById(String(req.params.id), {
            clientId: req.body.clientId,
            workerId: req.body.workerId === "" ? null : req.body.workerId,
            scheduledAt: req.body.scheduledAt === null ? null : (req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined),
            address: req.body.address,
            note: req.body.note,
            items: req.body.items,
        })

        res.json(order)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update order, ${error}`
        })
    }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateOrderStatusSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const currentUser = (req as any).user
        if (!currentUser?.id) {
            return res.status(401).send({
                message: "Unauthorized"
            })
        }

        const order = await updateOrderStatusById(
            String(req.params.id),
            normalizeStatus(req.body.status),
            currentUser.id,
            req.body.note,
        )

        res.json(order)
    } catch (error) {
        if (String(error).includes("Order not found")) {
            return res.status(404).send({
                message: "Order not found"
            })
        }

        res.status(500).send({
            message: `Failed to update order status, ${error}`
        })
    }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const checkOrder = await findOrderById(String(req.params.id))
        if (!checkOrder) {
            return res.status(404).send({
                message: "Order not found"
            })
        }

        await deleteOrderById(String(req.params.id))
        res.json({
            message: `Order ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete order, ${error}`
        })
    }
}
