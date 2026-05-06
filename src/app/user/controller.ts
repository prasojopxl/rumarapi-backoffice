import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

export function postUser(req: Request, res: Response, next: NextFunction) {
    const shcema = joi.object().keys({
        fullName: joi.string().min(3).required(),
        userName: joi.string().min(3).required(),
        email: joi.string().email().required(),
        roleId: joi.string().required(),
        password: joi.string().required(),
    })
    const { error } = shcema.validate(req.body)
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }
    const checkUser = async () => {
        const user = await prisma.user.findUnique({
            where: {
                userName: req.body.userName
            }
        })
        return user
    }
    checkUser()
        .then((user) => {
            if (user) {
                return res.status(400).send({
                    message: "User already exists"
                })
            }
        })
    async function main() {
        try {
            const password = await bcryptjs.hash(req.body.password, 10)
            await prisma.user.create({
                data: {
                    fullName: req.body.fullName,
                    userName: req.body.userName,
                    email: req.body.email,
                    roleId: req.body.roleId,
                    password: password,
                }
            })
            res.send({
                message: `User ${req.body.userName} created successfully`,
            })

        } catch (error) {
            res.status(500).send({
                message: "Failed to create user"
            })
        }
    }
    main()
}

export function getUsers(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    userName: true,
                    fullName: true,
                    email: true,
                    roleId: true,
                    role: true,
                    createdAt: true,
                    posts: true,
                }
            })
            res.json(users)
        } catch (error) {
            res.status(500).send({
                message: "Failed to fetch users"
            })
        }
    }
    main()
}

export function getUserID(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: String(req.params.id)
                },
                select: {
                    id: true,
                    userName: true,
                    fullName: true,
                    email: true,
                    roleId: true,
                    role: true,
                    createdAt: true,
                    posts: true,
                }
            })
            if (!user) {
                return res.status(400).send({
                    message: "User not found"
                })
            }
            res.json(user)
        } catch (error) {
            res.status(500).send({
                message: "Failed to fetch user"
            })
        }
    }
    main()
}

export function getUserMe(req: Request, res: Response, next: NextFunction) {
    const token = req.headers ? req.headers?.authorization : null
    if (!token || token === undefined) {
        return res.status(401).send({
            message: "Forbidden Access"
        });
    }
    const jwtToken = token?.split(" ").pop();
    const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

    async function main() {
        try {
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
            res.json(user)
        } catch (error) {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    }
    main()
}

export function updateUserMe(req: Request, res: Response, next: NextFunction) {
    const token = req.headers ? req.headers?.authorization : null
    if (!token || token === undefined) {
        return res.status(401).send({
            message: "Forbidden Access"
        });
    }
    const jwtToken = token?.split(" ").pop();
    const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

    async function main() {
        try {
            const checkUser = await prisma.user.findUnique({
                where: {
                    id: dataJwt.data.id
                }
            })

            if (!checkUser) {
                return res.status(400).send({
                    message: "User not found"
                })
            }

            const password = req.body.password ? await bcryptjs.hash(req.body.password, 10) : checkUser.password

            await prisma.user.update({
                where: {
                    id: dataJwt.data.id
                },
                data: {
                    fullName: req.body.fullName || checkUser.fullName,
                    password: password
                }
            })
            res.json({
                message: "User updated successfully",
            })
        } catch (error) {
            res.status(401).send({
                message: "Unauthorized"
            });
        }

    }
    main()
}



export function updateUser(req: Request, res: Response, next: NextFunction) {
    async function main() {
        const checkUser = await prisma.user.findUnique({
            where: {
                id: String(req.params.id)
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const user = await prisma.user.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                fullName: req.body.fullName || checkUser.fullName,
                userName: req.body.userName || checkUser.userName,
                email: req.body.email || checkUser.email,
                roleId: req.body.roleId || checkUser.roleId,
            }
        })
        return res.json(user)
    }
    main()
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
    const main = async () => {
        const checkUser = await prisma.user.findUnique({
            where: {
                id: String(req.params.id)
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        await prisma.user.delete({
            where: {
                id: String(req.params.id)
            }
        })
        return {
            res: res.json({
                message: `User ${req.params.id} deleted successfully`,
            }),
        }
    }
    main()
}