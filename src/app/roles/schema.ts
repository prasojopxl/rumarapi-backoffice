import joi from "joi"

export const createRoleSchema = joi.object({
    name: joi.string().min(2).required(),
})

export const updateRoleSchema = joi.object({
    name: joi.string().min(2).optional(),
}).min(1)
