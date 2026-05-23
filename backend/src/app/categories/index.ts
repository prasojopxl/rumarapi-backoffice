import express from "express"
import { deleteCategory, getCategories, getCategoryID, postCategory, updateCategory } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
	.get(verfyToken, getCategories)
	.post(verfyToken, postCategory)

app.route("/:id")
	.get(verfyToken, getCategoryID)
	.put(verfyToken, updateCategory)
	.delete(verfyToken, deleteCategory)

export default app