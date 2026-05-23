import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import nodemailer from "nodemailer"

const emailUser = process.env.EMAIL_USER || "prasojodesigner@gmail.com";
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPassword,
    },
});

export function testMail(req: Request, res: Response, next: NextFunction) {
    res.send("sendMail")
}

export function sendMail(req: Request, res: Response, next: NextFunction) {
    if (!emailPassword) {
        return res.status(500).send({
            message: "EMAIL_PASSWORD is missing. Use Gmail App Password (16 chars) in .env",
        })
    }

    const shcema = joi.object().keys({
        subject: joi.string().min(3).required(),
        to: joi.string().email().required(),
        message: joi.string().min(3).required()
    })
    const { error } = shcema.validate(req.body)
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    const { to, subject, message } = req.body;
    const mailData = {
        from: emailUser,
        to: to,
        subject: subject,
        text: message,
        html: message,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            if ((error as any).responseCode === 535) {
                return res.status(401).send({
                    message: "Gmail login rejected. Use EMAIL_PASSWORD as Google App Password, not your normal account password.",
                    detail: (error as any).response,
                })
            }

            return res.status(500).send({
                message: "Failed to send email",
                detail: (error as any).message,
            })
        }
        res.status(200).send(
            {
                message: "Email sent successfully",
                message_id: info.messageId
            });
    });
}