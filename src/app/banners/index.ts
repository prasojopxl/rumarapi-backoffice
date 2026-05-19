import express from "express"
import { deleteBanner, getBannerID, getBanners, postBanner, updateBanner } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getBanners)
    .post(verfyToken, postBanner)

app.route("/:id")
    .get(verfyToken, getBannerID)
    .put(verfyToken, updateBanner)
    .delete(verfyToken, deleteBanner)

export default app
