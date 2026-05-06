import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma";
export function Login(req: Request, res: Response, next: NextFunction) {
    async function main() {
        const shcema = joi.object().keys({
            userName: joi.string().required(),
            password: joi.string().required(),
        })
        const { error } = shcema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkUser = await prisma.user.findUnique({
            where: {
                userName: req.body.userName,
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const checkPassword = await bcrypt.compare(req.body.password, checkUser.password)
        const token: any = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60), //exp 1 hour
            data: {
                id: checkUser.id,
                userName: checkUser.userName,
                roleId: checkUser.roleId,
            }
        }, `${process.env.JWT_SECRET}`)
        if (!checkPassword) {
            return res.status(400).send({
                message: "Wrong password"
            })
        }
        return res.json({
            message: "Login successfully",
            name: checkUser.fullName,
            token
        })
    }
    main()
}