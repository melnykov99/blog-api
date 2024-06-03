import nodemailer from "nodemailer";
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
        const mailOptions = {
            from: "test-dev@internet.ru",
            to: emailRecipient,
            subject: "Registration confirmation",
            text: `Thank fo your registration. To finish registration please follow the link https://somesite.com/confirm-email?code=${confirmationCode}`,
            html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a></p><p>The code is valid for 24 hours</p>`,
        };
        await transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("Error sending email: ", error);
            }
        });
        return confirmationCode;
    },
};
export default emailService;