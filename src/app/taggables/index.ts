import express from "express"
import { deleteTaggable, getTaggableID, getTaggables, postTaggable, updateTaggable } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getTaggables)
    .post(verfyToken, postTaggable)

app.route("/:id")
    .get(verfyToken, getTaggableID)
    .put(verfyToken, updateTaggable)
    .delete(verfyToken, deleteTaggable)

export default app
