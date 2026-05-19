import { Request, Response, NextFunction } from 'express';
import { createProductSchema, updateProductSchema } from "./schema";
import { createProduct, deleteProductById, findProductById, findProducts, updateProductById } from "./model";

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await findProducts()
        res.json(products)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch products, ${error}`
        })
    }
}

export async function getProductID(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await findProductById(String(req.params.id))
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            })
        }
        res.json(product)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch product, ${error}`
        })
    }
}

export async function postProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createProductSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const product = await createProduct({
            categoryId: req.body.categoryId || undefined,
            thumbnailId: req.body.thumbnailId || undefined,
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            status: req.body.status,
        })

        res.status(201).json(product)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create product, ${error}`
        })
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateProductSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkProduct = await findProductById(String(req.params.id))
        if (!checkProduct) {
            return res.status(404).send({
                message: "Product not found"
            })
        }

        const product = await updateProductById(String(req.params.id), {
            categoryId: req.body.categoryId === "" ? null : req.body.categoryId,
            thumbnailId: req.body.thumbnailId === "" ? null : req.body.thumbnailId,
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            status: req.body.status,
        })

        res.json(product)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update product, ${error}`
        })
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const checkProduct = await findProductById(String(req.params.id))
        if (!checkProduct) {
            return res.status(404).send({
                message: "Product not found"
            })
        }

        await deleteProductById(String(req.params.id))
        res.json({
            message: `Product ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete product, ${error}`
        })
    }
}
