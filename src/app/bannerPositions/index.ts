import express from "express"
import {
    deleteBannerPosition,
    getBannerPositionID,
    getBannerPositions,
    postBannerPosition,
    updateBannerPosition,
} from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getBannerPositions)
    .post(verfyToken, postBannerPosition)

app.route("/:id")
    .get(verfyToken, getBannerPositionID)
    .put(verfyToken, updateBannerPosition)
    .delete(verfyToken, deleteBannerPosition)

export default app
