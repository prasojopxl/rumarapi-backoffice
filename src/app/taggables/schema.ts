import joi from "joi"

export const createTaggableSchema = joi.object({
    tagId: joi.string().required(),
    relatableId: joi.string().required(),
    relatableType: joi.string().valid("POST", "PRODUCT").required(),
})

export const updateTaggableSchema = joi.object({
    tagId: joi.string().optional(),
    relatableId: joi.string().optional(),
    relatableType: joi.string().valid("POST", "PRODUCT").optional(),
}).min(1)
