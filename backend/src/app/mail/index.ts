import express from "express"
import { sendMail, testMail } from "./controller"
import { verfyToken } from "../middleware/token"

const app = express()

app.route("/")
    .get(verfyToken, testMail)
    .post(verfyToken, sendMail)

export default app