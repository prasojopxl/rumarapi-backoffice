import { Request, Response, NextFunction } from 'express';
import { createImageSchema } from "./schema";
import {
    createImage as createImageRecord,
    findImageById,
    findImages,
} from "./model";

export function createImage(req: Request, res: Response, next: NextFunction) {
    const files: any = req.files
    const { error } = createImageSchema.validate({ files })
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }

    async function main() {
        try {
            await createImageRecord({
                filename: files[0].originalname,
                filePath: `/public/${files[0].filename}`,
                fileType: files[0].mimetype,
                fileSize: Number(files[0].size),
            })
            res.status(201).send({
                message: "Image upload successfully",
                data: {
                    title: files[0].originalname,
                    url: `/public/${files[0].filename}`,
                    mimetype: files[0].mimetype
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    main()
}

export function getImageID(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const image = await findImageById(String(req.params.id))
            if (!image) {
                return res.status(400).send({
                    message: "Image not found"
                })
            }
            res.json(image)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}

export function getImages(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const images = await findImages()
            res.json(images)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}