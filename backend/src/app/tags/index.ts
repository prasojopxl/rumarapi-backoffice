import express from "express"
import { deleteTag, getTagID, getTags, postTag, updateTag } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getTags)
    .post(verfyToken, postTag)

app.route("/:id")
    .get(verfyToken, getTagID)
    .put(verfyToken, updateTag)
    .delete(verfyToken, deleteTag)

export default app
