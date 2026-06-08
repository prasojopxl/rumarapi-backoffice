import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
dotenv.config()

export const verfyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers ? req.headers?.authorization : null
    if (!token || token === undefined) {
        return res.status(401).send({
            message: "Forbidden Access"
        });
    }
    const jwtToken = token?.split(" ").pop();

    try {
        const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);
        const user = await prisma.user.findUnique({
            where: {
                id: dataJwt.data.id
            }
        })
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        next();
    } catch (error) {
        res.status(401).send({
            message: "Unauthorized"
        });
    }
}

export const verifyApiToken = (requiredScope?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers?.authorization
        if (!token) {
            return res.status(401).send({
                message: "Forbidden Access"
            })
        }

        const jwtToken = token.split(" ").pop();

        try {
            const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);
            if (dataJwt?.data?.type !== "api" || !dataJwt?.data?.tokenId) {
                return res.status(401).send({
                    message: "Invalid API token"
                })
            }

            const apiToken = await prisma.apiToken.findUnique({
                where: {
                    id: dataJwt.data.tokenId
                }
            })

            if (!apiToken || !apiToken.isActive) {
                return res.status(401).send({
                    message: "API token is inactive"
                })
            }

            if (apiToken.expiresAt && new Date(apiToken.expiresAt).getTime() <= Date.now()) {
                return res.status(401).send({
                    message: "API token has expired"
                })
            }

            const scopes = Array.isArray(apiToken.scopes) ? apiToken.scopes : []
            if (requiredScope && !scopes.includes(requiredScope)) {
                return res.status(403).send({
                    message: "Insufficient scope"
                })
            }

            next()
        } catch (error) {
            return res.status(401).send({
                message: "Unauthorized"
            });
        }
    }
}
