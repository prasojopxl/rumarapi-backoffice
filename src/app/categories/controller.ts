import { Request, Response, NextFunction } from 'express';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
	try {
		res.json({
			message: "Get categories"
		})
	} catch (error) {
		res.status(500).send({
			message: "Failed to fetch categories"
		})
	}
}