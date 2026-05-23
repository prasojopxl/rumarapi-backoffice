import joi from "joi"

export const createTagSchema = joi.object({
    name: joi.string().min(2).required(),
    slug: joi.string().min(2).required(),
})

export const updateTagSchema = joi.object({
    name: joi.string().min(2).optional(),
    slug: joi.string().min(2).optional(),
}).min(1)
