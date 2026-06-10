import joi from "joi"

const orderStatusValues = ["DRAFT", "PENDING", "CANCEL", "REJECT", "EXPIRED", "PROCESS", "ON_PROGRESS", "DONE"]

const orderItemSchema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().integer().min(1).optional().default(1),
    discount: joi.number().min(0).optional().default(0),
    startTime: joi.date().iso().optional().allow(null),
    endTime: joi.date().iso().optional().allow(null),
})

export const createOrderSchema = joi.object({
    clientId: joi.string().required(),
    workerId: joi.string().optional().allow(null, ""),
    status: joi.string().uppercase().valid(...orderStatusValues).optional(),
    scheduledAt: joi.date().iso().optional().allow(null),
    address: joi.string().min(3).required(),
    note: joi.string().allow("", null).optional(),
    items: joi.array().items(orderItemSchema).min(1).required(),
})

export const updateOrderSchema = joi.object({
    clientId: joi.string().optional(),
    workerId: joi.string().optional().allow(null, ""),
    scheduledAt: joi.date().iso().optional().allow(null),
    address: joi.string().min(3).optional(),
    note: joi.string().allow("", null).optional(),
    items: joi.array().items(orderItemSchema).min(1).optional(),
}).min(1)

export const updateOrderStatusSchema = joi.object({
    status: joi.string().uppercase().valid(...orderStatusValues).required(),
    note: joi.string().allow("", null).optional(),
}).required()
