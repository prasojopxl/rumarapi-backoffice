import joi from "joi"

export const loginSchema = joi.object({
	userName: joi.string().required(),
	password: joi.string().required(),
})
