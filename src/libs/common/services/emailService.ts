import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: " ",
        pass: " ",
    },
});
const emailService = {
    hello() {
        const mailOptions = {
            from: "Blog-Api",
            to: " ",
            subject: "Confirmation email code",
            text: "",
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });
    }
}