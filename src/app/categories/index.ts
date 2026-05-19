import express from "express"
import { getCategories } from "./controller";	
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
	.get(verfyToken, getCategories)

export default app