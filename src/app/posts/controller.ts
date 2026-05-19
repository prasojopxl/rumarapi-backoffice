import { Request, Response, NextFunction } from 'express';
import { createPostSchema, updatePostSchema } from "./schema";
import { createPost, deletePostById, findPostById, findPosts, updatePostById } from "./model";

export async function getPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await findPosts()
        res.json(posts)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch posts, ${error}`
        })
    }
}

export async function getPostID(req: Request, res: Response, next: NextFunction) {
    try {
        const post = await findPostById(String(req.params.id))
        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            })
        }
        res.json(post)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch post, ${error}`
        })
    }
}

export async function postPost(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createPostSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const post = await createPost({
            authorId: req.body.authorId,
            featuredImageId: req.body.featuredImageId || undefined,
            title: req.body.title,
            slug: req.body.slug,
            content: req.body.content,
            type: req.body.type,
            status: req.body.status,
        })

        res.status(201).json(post)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create post, ${error}`
        })
    }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updatePostSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkPost = await findPostById(String(req.params.id))
        if (!checkPost) {
            return res.status(404).send({
                message: "Post not found"
            })
        }

        const post = await updatePostById(String(req.params.id), {
            authorId: req.body.authorId,
            featuredImageId: req.body.featuredImageId === "" ? null : req.body.featuredImageId,
            title: req.body.title,
            slug: req.body.slug,
            content: req.body.content,
            type: req.body.type,
            status: req.body.status,
        })

        res.json(post)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update post, ${error}`
        })
    }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
    try {
        const checkPost = await findPostById(String(req.params.id))
        if (!checkPost) {
            return res.status(404).send({
                message: "Post not found"
            })
        }

        await deletePostById(String(req.params.id))
        res.json({
            message: `Post ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete post, ${error}`
        })
    }
}
