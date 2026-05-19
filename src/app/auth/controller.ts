import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma";
import { createApiTokenSchema, loginSchema, updateApiTokenScopeSchema } from "./schema";
import { findUserByUserName } from "./model";

export async function Login(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = loginSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkUser = await findUserByUserName(req.body.userName)
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const checkPassword = await bcrypt.compare(req.body.password, checkUser.password)
        if (!checkPassword) {
            return res.status(400).send({
                message: "Wrong password"
            })
        }
        const token: any = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                id: checkUser.id,
                userName: checkUser.userName,
                roleId: checkUser.roleId,
            }
        }, `${process.env.JWT_SECRET}`)
        return res.json({
            message: "Login successfully",
            name: checkUser.fullName,
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: `Login failed: ${error}`
        })
    }
}

export async function CreateApiToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = createApiTokenSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        if (!process.env.API_TOKEN_ISSUER_KEY) {
            return res.status(500).send({
                message: "API_TOKEN_ISSUER_KEY is not configured"
            })
        }

        if (value.clientKey !== process.env.API_TOKEN_ISSUER_KEY) {
            return res.status(401).send({
                message: "Invalid client key"
            })
        }

        const presetHours = value.expiresPresetDays ? Number(value.expiresPresetDays) * 24 : undefined
        const expiresInHours = value.expiresInHours ?? presetHours
        const expiresAt = expiresInHours
            ? new Date(Date.now() + (expiresInHours * 60 * 60 * 1000))
            : null

        const apiToken = await prisma.apiToken.create({
            data: {
                name: value.name,
                scopes: value.scope,
                expiresAt,
                isActive: true,
            }
        })

        const payload: any = {
            data: {
                type: "api",
                tokenId: apiToken.id,
            }
        }

        if (expiresAt) {
            payload.exp = Math.floor(expiresAt.getTime() / 1000)
        }

        const token = jwt.sign(payload, `${process.env.JWT_SECRET}`)

        return res.status(201).json({
            message: "API token created",
            token,
            tokenId: apiToken.id,
            scope: apiToken.scopes,
            expiresAt: apiToken.expiresAt,
            expiresInHours: expiresInHours ?? null,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: `Create API token failed: ${error}`
        })
    }
}

export async function UpdateApiTokenScope(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = updateApiTokenScopeSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        if (!process.env.API_TOKEN_ISSUER_KEY) {
            return res.status(500).send({
                message: "API_TOKEN_ISSUER_KEY is not configured"
            })
        }

        if (value.clientKey !== process.env.API_TOKEN_ISSUER_KEY) {
            return res.status(401).send({
                message: "Invalid client key"
            })
        }

        const updated = await prisma.apiToken.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                scopes: value.scope,
            }
        })

        return res.json({
            message: "API token scope updated",
            tokenId: updated.id,
            scope: updated.scopes,
            expiresAt: updated.expiresAt,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: `Update API token scope failed: ${error}`
        })
    }
}