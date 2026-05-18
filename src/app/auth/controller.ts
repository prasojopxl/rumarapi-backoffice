import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { loginSchema } from "./schema";
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