import joi from "joi"

export const createCategorySchema = joi.object({
    name: joi.string().min(2).required(),
    slug: joi.string().min(2).required(),
    description: joi.string().allow("", null).optional(),
})

export const updateCategorySchema = joi.object({
    name: joi.string().min(2).optional(),
    slug: joi.string().min(2).optional(),
    description: joi.string().allow("", null).optional(),
}).min(1)
