import joi from "joi"

export const createBannerSchema = joi.object({
    positionId: joi.string().required(),
    mediaId: joi.string().optional().allow(null, ""),
    title: joi.string().optional().allow("", null),
    subTitle: joi.string().optional().allow("", null),
    linkUrl: joi.string().optional().allow("", null),
    orderPriority: joi.number().integer().optional(),
    isActive: joi.boolean().optional(),
    startDate: joi.date().optional().allow(null),
    endDate: joi.date().optional().allow(null),
})

export const updateBannerSchema = joi.object({
    positionId: joi.string().optional(),
    mediaId: joi.string().optional().allow(null, ""),
    title: joi.string().optional().allow("", null),
    subTitle: joi.string().optional().allow("", null),
    linkUrl: joi.string().optional().allow("", null),
    orderPriority: joi.number().integer().optional(),
    isActive: joi.boolean().optional(),
    startDate: joi.date().optional().allow(null),
    endDate: joi.date().optional().allow(null),
}).min(1)
