import joi from "joi"

export const createUserSchema = joi.object({
	fullName: joi.string().min(3).required(),
	userName: joi.string().min(3).required(),
	email: joi.string().email().required(),
	roleId: joi.string().required(),
	password: joi.string().required(),
})
