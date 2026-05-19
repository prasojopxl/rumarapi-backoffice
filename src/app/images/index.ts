import express from "express"
import { createImage, getImageID, getImages } from "./controller"
import { verifyApiToken, verfyToken } from "../middleware/token"

const app = express()

app.route("/")
    .get(verifyApiToken("images:read"), getImages)
    .post(verfyToken, createImage)

app.route("/:id")
    .get(verifyApiToken("images:read"), getImageID)

export default app