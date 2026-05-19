import express from "express"
import { CreateApiToken, GetApiTokens, Login, UpdateApiTokenScope } from "./controller"

const app = express()

app.route("/login")
    .post(Login)

app.route("/token")
    .get(GetApiTokens)
    .post(CreateApiToken)

app.route("/token/:id/scope")
    .patch(UpdateApiTokenScope)


export default app