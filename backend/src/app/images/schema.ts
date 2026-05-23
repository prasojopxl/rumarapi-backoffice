import joi from "joi"

export const createImageSchema = joi.object({
	files: joi.array().items(joi.object({
		fieldname: joi.string().required(),
		originalname: joi.string().required(),
		encoding: joi.string().required(),
		mimetype: joi.string().required(),
		destination: joi.string().required(),
		filename: joi.string().required(),
		path: joi.string().required(),
		size: joi.number().max(1000000).required(),
	})).required(),
})
