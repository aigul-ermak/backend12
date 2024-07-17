import nodemailer from 'nodemailer';

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ermakgul@gmail.com",
                //password
                pass: "nqktibuqtptqvbci"
            }
        });

        let info = await transport.sendMail({
            from: 'Aigul <ermakgul@gmail.com>',
            to: email,
            subject: subject,
            html: message
        });

        console.log(info.messageId)

        // res.send({
        //     "email": req.body.email,
        //     "message": req.body.message,
        //     "subject": req.body.subject,
        // })
    }
}