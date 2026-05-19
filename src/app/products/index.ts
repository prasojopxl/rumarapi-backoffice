import express from "express"
import { deleteProduct, getProductID, getProducts, postProduct, updateProduct } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getProducts)
    .post(verfyToken, postProduct)

app.route("/:id")
    .get(verfyToken, getProductID)
    .put(verfyToken, updateProduct)
    .delete(verfyToken, deleteProduct)

export default app
