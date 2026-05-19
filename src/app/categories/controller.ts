import { Request, Response, NextFunction } from 'express';
import { createCategorySchema, updateCategorySchema } from "./schema";
import {
	createCategory,
	deleteCategoryById,
	findCategories,
	findCategoryById,
	updateCategoryById,
} from "./model";

export async function getCategories(req: Request, res: Response, next: NextFunction) {
	try {
		const categories = await findCategories()
		res.json(categories)
	} catch (error) {
		res.status(500).send({
			message: `Failed to fetch categories, ${error}`
		})
	}
}

export async function getCategoryID(req: Request, res: Response, next: NextFunction) {
	try {
		const category = await findCategoryById(String(req.params.id))
		if (!category) {
			return res.status(404).send({
				message: "Category not found"
			})
		}
		res.json(category)
	} catch (error) {
		res.status(500).send({
			message: `Failed to fetch category, ${error}`
		})
	}
}

export async function postCategory(req: Request, res: Response, next: NextFunction) {
	try {
		const { error } = createCategorySchema.validate(req.body)
		if (error) {
			return res.status(400).send({
				message: error.message
			})
		}

		const category = await createCategory({
			name: req.body.name,
			slug: req.body.slug,
			description: req.body.description,
		})

		res.status(201).json(category)
	} catch (error) {
		res.status(500).send({
			message: `Failed to create category, ${error}`
		})
	}
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
	try {
		const { error } = updateCategorySchema.validate(req.body)
		if (error) {
			return res.status(400).send({
				message: error.message
			})
		}

		const checkCategory = await findCategoryById(String(req.params.id))
		if (!checkCategory) {
			return res.status(404).send({
				message: "Category not found"
			})
		}

		const category = await updateCategoryById(String(req.params.id), {
			name: req.body.name,
			slug: req.body.slug,
			description: req.body.description,
		})

		res.json(category)
	} catch (error) {
		res.status(500).send({
			message: `Failed to update category, ${error}`
		})
	}
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
	try {
		const checkCategory = await findCategoryById(String(req.params.id))
		if (!checkCategory) {
			return res.status(404).send({
				message: "Category not found"
			})
		}

		await deleteCategoryById(String(req.params.id))
		res.json({
			message: `Category ${req.params.id} deleted successfully`,
		})
	} catch (error) {
		res.status(500).send({
			message: `Failed to delete category, ${error}`
		})
	}
}