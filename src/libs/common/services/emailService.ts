import nodemailer from 'nodemailer'
import {randomUUID} from "crypto";

const transporter = nodemailer.createTransport({
    service: "mail",
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const emailService = {
    async sendRegistrationMessage(emailRecipient: string): Promise<string> {
        const confirmationCode: string = randomUUID();

        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("email server is ready");
                    resolve(success);
                }
            });
        });

        const mailOptions = {
            from: "test-dev@internet.ru",
            to: emailRecipient,
            subject: "Registration confirmation",
            text: `Thank fo your registration. To finish registration please follow the link https://somesite.com/confirm-email?code=${confirmationCode}`,
            html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a></p><p>The code is valid for 24 hours</p>`,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });

        return confirmationCode
    },
    async send(emailRecipient: string) {

    }
}
export default emailService;