import express from "express"
import { deletePost, getPostID, getPosts, postPost, updatePost } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getPosts)
    .post(verfyToken, postPost)

app.route("/:id")
    .get(verfyToken, getPostID)
    .put(verfyToken, updatePost)
    .delete(verfyToken, deletePost)

export default app
