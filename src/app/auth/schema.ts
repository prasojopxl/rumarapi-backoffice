import joi from "joi"

export const loginSchema = joi.object({
	userName: joi.string().required(),
	password: joi.string().required(),
})

export const createApiTokenSchema = joi.object({
	clientKey: joi.string().required(),
	name: joi.string().max(100).optional(),
	scope: joi.array().items(joi.string()).min(1).required(),
	expiresPresetDays: joi.number().valid(30, 90).optional(),
	expiresInHours: joi.number().integer().min(1).max(24 * 365).optional(),
})

export const updateApiTokenScopeSchema = joi.object({
	clientKey: joi.string().required(),
	scope: joi.array().items(joi.string()).min(1).required(),
})
