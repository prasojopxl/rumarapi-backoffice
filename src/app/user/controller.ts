import { Request, Response, NextFunction } from 'express';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import { createUserSchema } from "./schema";
import {
    createUser,
    deleteUserById,
    findUserById,
    findUserByUserName,
    findUserProfileById,
    findUsers,
    updateUserById,
    updateUserProfile,
} from "./model";

export async function postUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createUserSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }
        
        const existingUser = await findUserByUserName(req.body.userName)
        if (existingUser) {
            return res.status(400).send({
                message: "User already exists"
            })
        }
        
        const password = await bcryptjs.hash(req.body.password, 10)
        await createUser({
            fullName: req.body.fullName,
            userName: req.body.userName,
            email: req.body.email,
            roleId: req.body.roleId,
            password,
        })
        res.send({
            message: `User ${req.body.userName} created successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to create user, ${error}`
        })
    }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await findUsers()
        res.json(users)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch users, ${error}`
        })
    }
}

export async function getUserID(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await findUserById(String(req.params.id))
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

export async function getUserMe(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers ? req.headers?.authorization : null
        if (!token || token === undefined) {
            return res.status(401).send({
                message: "Forbidden Access"
            });
        }
        const jwtToken = token?.split(" ").pop();
        const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

        const user = await findUserProfileById(dataJwt.data.id)
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

export async function updateUserMe(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers ? req.headers?.authorization : null
        if (!token || token === undefined) {
            return res.status(401).send({
                message: "Forbidden Access"
            });
        }
        const jwtToken = token?.split(" ").pop();
        const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

        const checkUser = await findUserProfileById(dataJwt.data.id)

        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }

        const password = req.body.password ? await bcryptjs.hash(req.body.password, 10) : checkUser.password

        await updateUserProfile(dataJwt.data.id, {
            fullName: req.body.fullName || checkUser.fullName,
            password,
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



export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const checkUser = await findUserProfileById(String(req.params.id))
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const user = await updateUserById(String(req.params.id), {
            fullName: req.body.fullName || checkUser.fullName,
            userName: req.body.userName || checkUser.userName,
            email: req.body.email || checkUser.email,
            roleId: req.body.roleId || checkUser.roleId,
        })
        return res.json(user)
    } catch (error) {
        return res.status(500).send({
            message: `Failed to update user, ${error}`
        })
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const checkUser = await findUserProfileById(String(req.params.id))
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        await deleteUserById(String(req.params.id))
        return res.json({
            message: `User ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        return res.status(500).send({
            message: `Failed to delete user, ${error}`
        })
    }
}