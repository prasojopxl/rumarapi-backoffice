import express from "express"
import { deleteOrder, getOrderID, getOrders, postOrder, updateOrder, updateOrderStatus } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getOrders)
    .post(verfyToken, postOrder)

app.route("/:id")
    .get(verfyToken, getOrderID)
    .put(verfyToken, updateOrder)
    .delete(verfyToken, deleteOrder)

app.patch("/:id/status", verfyToken, updateOrderStatus)

export default app
