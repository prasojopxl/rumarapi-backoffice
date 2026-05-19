import joi from "joi"

export const createBannerPositionSchema = joi.object({
    name: joi.string().min(2).required(),
    slug: joi.string().min(2).required(),
    status: joi.string().optional(),
})

export const updateBannerPositionSchema = joi.object({
    name: joi.string().min(2).optional(),
    slug: joi.string().min(2).optional(),
    status: joi.string().optional(),
}).min(1)
