import express from "express"
import { createImage, getImageID, getImages } from "./controller"
import { verfyToken } from "../middleware/token"

const app = express()

app.route("/")
    .get(verfyToken, getImages)
    .post(verfyToken, createImage)

app.route("/:id")
    .get(verfyToken, getImageID)

export default app