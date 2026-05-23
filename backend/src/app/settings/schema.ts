import joi from "joi"

export const createSettingSchema = joi.object({
    key: joi.string().required(),
    value: joi.string().required(),
    siteName: joi.string().allow("", null).optional(),
})

export const updateSettingSchema = joi.object({
    value: joi.string().optional(),
    siteName: joi.string().allow("", null).optional(),
}).min(1)
