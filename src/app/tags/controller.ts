import { Request, Response, NextFunction } from 'express';
import { createTagSchema, updateTagSchema } from "./schema";
import { createTag, deleteTagById, findTagById, findTags, updateTagById } from "./model";

export async function getTags(req: Request, res: Response, next: NextFunction) {
    try {
        const tags = await findTags()
        res.json(tags)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch tags, ${error}`
        })
    }
}

export async function getTagID(req: Request, res: Response, next: NextFunction) {
    try {
        const tag = await findTagById(String(req.params.id))
        if (!tag) {
            return res.status(404).send({
                message: "Tag not found"
            })
        }
        res.json(tag)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch tag, ${error}`
        })
    }
}

export async function postTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createTagSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const tag = await createTag({
            name: req.body.name,
            slug: req.body.slug,
        })

        res.status(201).json(tag)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create tag, ${error}`
        })
    }
}

export async function updateTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateTagSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkTag = await findTagById(String(req.params.id))
        if (!checkTag) {
            return res.status(404).send({
                message: "Tag not found"
            })
        }

        const tag = await updateTagById(String(req.params.id), {
            name: req.body.name,
            slug: req.body.slug,
        })

        res.json(tag)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update tag, ${error}`
        })
    }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
        const checkTag = await findTagById(String(req.params.id))
        if (!checkTag) {
            return res.status(404).send({
                message: "Tag not found"
            })
        }

        await deleteTagById(String(req.params.id))
        res.json({
            message: `Tag ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete tag, ${error}`
        })
    }
}
