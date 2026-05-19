import express from "express"
import { deleteRole, getRoleID, getRoles, postRole, updateRole } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getRoles)
    .post(verfyToken, postRole)

app.route("/:id")
    .get(verfyToken, getRoleID)
    .put(verfyToken, updateRole)
    .delete(verfyToken, deleteRole)

export default app
