import { Request, Response, NextFunction } from 'express';
import imageSize from "image-size";
import joi from "joi"
import { prisma } from "../../lib/prisma";


const path = require('path');

export function createImage(req: Request, res: Response, next: NextFunction) {
    const files: any = req.files
    const schema = joi.object().keys({
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
    const { error } = schema.validate({ files })
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }

    async function main() {
        try {
            await prisma.media.create({
                data: {
                    filename: files[0].originalname,
                    filePath: `/public/${files[0].filename}`,
                    fileType: files[0].mimetype,
                    fileSize: Number(files[0].size),
                }
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

            const image = await prisma.media.findUnique({
                where: {
                    id: String(req.params.id)
                }
            })
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
            const images = await prisma.media.findMany()
            res.json(images)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}