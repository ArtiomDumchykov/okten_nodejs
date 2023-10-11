import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

import { configs } from '../config';
import { templates } from '../constatns';
import { EEmailAction } from '../enums';

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            from: 'No reply',
            service: 'gmail',
            auth: {
                user: configs.emailAuth.NO_REPLY_EMAIL,
                pass: configs.emailAuth.NO_REPLY_PASSWORD
            }
        });


        const hbsOptions = {
            viewEngine: {
                extname: '.hbs',
                defaultLayout: 'main',
                layoutsDir: path.join(
                    process.cwd(),
                    'src',
                    'templates',
                    'email',
                    'layouts'
                ),
                partialsDir: path.join(
                    process.cwd(),
                    'src',
                    'templates',
                    'email',
                    'partials'
                )
            },
            viewPath: path.join(process.cwd(), 'src', 'templates', 'email', 'views'),
            extName: '.hbs'
        }

        this.transporter.use('compile', hbs(hbsOptions))
    }
    // public async sendMail(email: string) {
    //     return await this.transporter.sendMail({
    //         to: email,
    //         subject: "Subject",
    //         html: `
    //         <div>Hello World !!!</div>`,
    //     })
    // }

    public async sendMail(email: string | string[], emailAction: EEmailAction, context: Record<string, string | number> = {}) {

        const {subject, templateName} = templates[emailAction]

        context.frontUrl= configs.urls.FRONT_URL

        const emailOptions = {
            to: email,
            subject,
            template: templateName,
            context
        }

        return await this.transporter.sendMail(emailOptions)
    }
}

export const emailService = new EmailService()