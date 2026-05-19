import express from "express"
import { createImage, getImageID, getImages } from "./controller"
import { verifyApiToken } from "../middleware/token"

const app = express()

app.route("/")
    .get(verifyApiToken("images:read"), getImages)
    .post(createImage)

app.route("/:id")
    .get(verifyApiToken("images:read"), getImageID)

export default app