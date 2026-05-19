import { Request, Response, NextFunction } from 'express';
import { createBannerSchema, updateBannerSchema } from "./schema";
import { createBanner, deleteBannerById, findBannerById, findBanners, updateBannerById } from "./model";

export async function getBanners(req: Request, res: Response, next: NextFunction) {
    try {
        const banners = await findBanners()
        res.json(banners)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch banners, ${error}`
        })
    }
}

export async function getBannerID(req: Request, res: Response, next: NextFunction) {
    try {
        const banner = await findBannerById(String(req.params.id))
        if (!banner) {
            return res.status(404).send({
                message: "Banner not found"
            })
        }
        res.json(banner)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch banner, ${error}`
        })
    }
}

export async function postBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createBannerSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const banner = await createBanner({
            positionId: req.body.positionId,
            mediaId: req.body.mediaId || undefined,
            title: req.body.title,
            subTitle: req.body.subTitle,
            linkUrl: req.body.linkUrl,
            orderPriority: req.body.orderPriority,
            isActive: req.body.isActive,
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        })

        res.status(201).json(banner)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create banner, ${error}`
        })
    }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateBannerSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkBanner = await findBannerById(String(req.params.id))
        if (!checkBanner) {
            return res.status(404).send({
                message: "Banner not found"
            })
        }

        const banner = await updateBannerById(String(req.params.id), {
            positionId: req.body.positionId,
            mediaId: req.body.mediaId === "" ? null : req.body.mediaId,
            title: req.body.title,
            subTitle: req.body.subTitle,
            linkUrl: req.body.linkUrl,
            orderPriority: req.body.orderPriority,
            isActive: req.body.isActive,
            startDate: req.body.startDate === null ? null : (req.body.startDate ? new Date(req.body.startDate) : undefined),
            endDate: req.body.endDate === null ? null : (req.body.endDate ? new Date(req.body.endDate) : undefined),
        })

        res.json(banner)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update banner, ${error}`
        })
    }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const checkBanner = await findBannerById(String(req.params.id))
        if (!checkBanner) {
            return res.status(404).send({
                message: "Banner not found"
            })
        }

        await deleteBannerById(String(req.params.id))
        res.json({
            message: `Banner ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete banner, ${error}`
        })
    }
}
