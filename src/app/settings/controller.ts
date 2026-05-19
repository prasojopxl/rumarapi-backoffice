import { Request, Response, NextFunction } from 'express';
import { createSettingSchema, updateSettingSchema } from "./schema";
import { createSetting, deleteSettingByKey, findSettingByKey, findSettings, updateSettingByKey } from "./model";

export async function getSettings(req: Request, res: Response, next: NextFunction) {
    try {
        const settings = await findSettings()
        res.json(settings)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch settings, ${error}`
        })
    }
}

export async function getSettingKey(req: Request, res: Response, next: NextFunction) {
    try {
        const setting = await findSettingByKey(String(req.params.key))
        if (!setting) {
            return res.status(404).send({
                message: "Setting not found"
            })
        }
        res.json(setting)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch setting, ${error}`
        })
    }
}

export async function postSetting(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createSettingSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const setting = await createSetting({
            key: req.body.key,
            value: req.body.value,
            siteName: req.body.siteName,
        })

        res.status(201).json(setting)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create setting, ${error}`
        })
    }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateSettingSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkSetting = await findSettingByKey(String(req.params.key))
        if (!checkSetting) {
            return res.status(404).send({
                message: "Setting not found"
            })
        }

        const setting = await updateSettingByKey(String(req.params.key), {
            value: req.body.value,
            siteName: req.body.siteName,
        })

        res.json(setting)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update setting, ${error}`
        })
    }
}

export async function deleteSetting(req: Request, res: Response, next: NextFunction) {
    try {
        const checkSetting = await findSettingByKey(String(req.params.key))
        if (!checkSetting) {
            return res.status(404).send({
                message: "Setting not found"
            })
        }

        await deleteSettingByKey(String(req.params.key))
        res.json({
            message: `Setting ${req.params.key} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete setting, ${error}`
        })
    }
}
