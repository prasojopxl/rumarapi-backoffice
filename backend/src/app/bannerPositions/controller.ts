import { Request, Response, NextFunction } from 'express';
import { createBannerPositionSchema, updateBannerPositionSchema } from "./schema";
import {
    createBannerPosition,
    deleteBannerPositionById,
    findBannerPositionById,
    findBannerPositions,
    updateBannerPositionById,
} from "./model";

export async function getBannerPositions(req: Request, res: Response, next: NextFunction) {
    try {
        const bannerPositions = await findBannerPositions()
        res.json(bannerPositions)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch banner positions, ${error}`
        })
    }
}

export async function getBannerPositionID(req: Request, res: Response, next: NextFunction) {
    try {
        const bannerPosition = await findBannerPositionById(String(req.params.id))
        if (!bannerPosition) {
            return res.status(404).send({
                message: "Banner position not found"
            })
        }
        res.json(bannerPosition)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch banner position, ${error}`
        })
    }
}

export async function postBannerPosition(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createBannerPositionSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const bannerPosition = await createBannerPosition({
            name: req.body.name,
            slug: req.body.slug,
            status: req.body.status,
        })

        res.status(201).json(bannerPosition)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create banner position, ${error}`
        })
    }
}

export async function updateBannerPosition(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateBannerPositionSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkBannerPosition = await findBannerPositionById(String(req.params.id))
        if (!checkBannerPosition) {
            return res.status(404).send({
                message: "Banner position not found"
            })
        }

        const bannerPosition = await updateBannerPositionById(String(req.params.id), {
            name: req.body.name,
            slug: req.body.slug,
            status: req.body.status,
        })

        res.json(bannerPosition)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update banner position, ${error}`
        })
    }
}

export async function deleteBannerPosition(req: Request, res: Response, next: NextFunction) {
    try {
        const checkBannerPosition = await findBannerPositionById(String(req.params.id))
        if (!checkBannerPosition) {
            return res.status(404).send({
                message: "Banner position not found"
            })
        }

        await deleteBannerPositionById(String(req.params.id))
        res.json({
            message: `Banner position ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete banner position, ${error}`
        })
    }
}
