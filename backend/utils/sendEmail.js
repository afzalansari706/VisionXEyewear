const nodeMailer = require("nodemailer");

const sendEmail = async (options) =>{ //option are sendEmail of try block i.e email,Subject,message

    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{ //it is author email and password like creator of project
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    });

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message // message create in userController
    };

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;