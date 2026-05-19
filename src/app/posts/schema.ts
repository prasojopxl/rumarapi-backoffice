import joi from "joi"

export const createPostSchema = joi.object({
    authorId: joi.string().required(),
    featuredImageId: joi.string().optional().allow(null, ""),
    title: joi.string().min(2).required(),
    slug: joi.string().min(2).required(),
    content: joi.string().required(),
    type: joi.string().optional(),
    status: joi.string().optional(),
})

export const updatePostSchema = joi.object({
    authorId: joi.string().optional(),
    featuredImageId: joi.string().optional().allow(null, ""),
    title: joi.string().min(2).optional(),
    slug: joi.string().min(2).optional(),
    content: joi.string().optional(),
    type: joi.string().optional(),
    status: joi.string().optional(),
}).min(1)
