import { Request, Response, NextFunction } from 'express';
import { createTaggableSchema, updateTaggableSchema } from "./schema";
import { createTaggable, deleteTaggableById, findTaggableById, findTaggables, updateTaggableById } from "./model";

export async function getTaggables(req: Request, res: Response, next: NextFunction) {
    try {
        const taggables = await findTaggables()
        res.json(taggables)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch taggables, ${error}`
        })
    }
}

export async function getTaggableID(req: Request, res: Response, next: NextFunction) {
    try {
        const taggable = await findTaggableById(String(req.params.id))
        if (!taggable) {
            return res.status(404).send({
                message: "Taggable not found"
            })
        }
        res.json(taggable)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch taggable, ${error}`
        })
    }
}

export async function postTaggable(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createTaggableSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const taggable = await createTaggable({
            tagId: req.body.tagId,
            relatableId: req.body.relatableId,
            relatableType: req.body.relatableType,
        })

        res.status(201).json(taggable)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create taggable, ${error}`
        })
    }
}

export async function updateTaggable(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateTaggableSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkTaggable = await findTaggableById(String(req.params.id))
        if (!checkTaggable) {
            return res.status(404).send({
                message: "Taggable not found"
            })
        }

        const taggable = await updateTaggableById(String(req.params.id), {
            tagId: req.body.tagId,
            relatableId: req.body.relatableId,
            relatableType: req.body.relatableType,
        })

        res.json(taggable)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update taggable, ${error}`
        })
    }
}

export async function deleteTaggable(req: Request, res: Response, next: NextFunction) {
    try {
        const checkTaggable = await findTaggableById(String(req.params.id))
        if (!checkTaggable) {
            return res.status(404).send({
                message: "Taggable not found"
            })
        }

        await deleteTaggableById(String(req.params.id))
        res.json({
            message: `Taggable ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete taggable, ${error}`
        })
    }
}
