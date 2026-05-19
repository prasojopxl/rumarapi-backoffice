import { Request, Response, NextFunction } from 'express';
import { createRoleSchema, updateRoleSchema } from "./schema";
import { createRole, deleteRoleById, findRoleById, findRoles, updateRoleById } from "./model";

export async function getRoles(req: Request, res: Response, next: NextFunction) {
    try {
        const roles = await findRoles()
        res.json(roles)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch roles, ${error}`
        })
    }
}

export async function getRoleID(req: Request, res: Response, next: NextFunction) {
    try {
        const role = await findRoleById(String(req.params.id))
        if (!role) {
            return res.status(404).send({
                message: "Role not found"
            })
        }
        res.json(role)
    } catch (error) {
        res.status(500).send({
            message: `Failed to fetch role, ${error}`
        })
    }
}

export async function postRole(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = createRoleSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const role = await createRole({
            name: req.body.name,
        })

        res.status(201).json(role)
    } catch (error) {
        res.status(500).send({
            message: `Failed to create role, ${error}`
        })
    }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = updateRoleSchema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkRole = await findRoleById(String(req.params.id))
        if (!checkRole) {
            return res.status(404).send({
                message: "Role not found"
            })
        }

        const role = await updateRoleById(String(req.params.id), {
            name: req.body.name,
        })

        res.json(role)
    } catch (error) {
        res.status(500).send({
            message: `Failed to update role, ${error}`
        })
    }
}

export async function deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
        const checkRole = await findRoleById(String(req.params.id))
        if (!checkRole) {
            return res.status(404).send({
                message: "Role not found"
            })
        }

        await deleteRoleById(String(req.params.id))
        res.json({
            message: `Role ${req.params.id} deleted successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: `Failed to delete role, ${error}`
        })
    }
}
