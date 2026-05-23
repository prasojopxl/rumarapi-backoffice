import joi from "joi"

export const createProductSchema = joi.object({
    categoryId: joi.string().optional().allow(null, ""),
    thumbnailId: joi.string().optional().allow(null, ""),
    name: joi.string().min(2).required(),
    slug: joi.string().min(2).required(),
    description: joi.string().allow("", null).optional(),
    price: joi.number().required(),
    stock: joi.number().integer().min(0).optional(),
    status: joi.string().optional(),
})

export const updateProductSchema = joi.object({
    categoryId: joi.string().optional().allow(null, ""),
    thumbnailId: joi.string().optional().allow(null, ""),
    name: joi.string().min(2).optional(),
    slug: joi.string().min(2).optional(),
    description: joi.string().allow("", null).optional(),
    price: joi.number().optional(),
    stock: joi.number().integer().min(0).optional(),
    status: joi.string().optional(),
}).min(1)
