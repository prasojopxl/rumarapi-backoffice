import express from "express"
import { CreateApiToken, Login, UpdateApiTokenScope } from "./controller"

const app = express()

app.route("/login")
    .post(Login)

app.route("/token")
    .post(CreateApiToken)

app.route("/token/:id/scope")
    .patch(UpdateApiTokenScope)


export default app