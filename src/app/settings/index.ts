import express from "express"
import { deleteSetting, getSettingKey, getSettings, postSetting, updateSetting } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getSettings)
    .post(verfyToken, postSetting)

app.route("/:key")
    .get(verfyToken, getSettingKey)
    .put(verfyToken, updateSetting)
    .delete(verfyToken, deleteSetting)

export default app
