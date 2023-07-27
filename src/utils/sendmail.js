const sgMail = require ('@sendgrid/mail');
const dotenv = require("dotenv");
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendForgotPasswordMail = (mailPayload) => {
    const textMail =`<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        h1 {
            color: #007bff;
            text-align: center;
            font-size: 20px;
            margin-bottom: 20px;
        }
        h3 {
            color: #fff solid;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            margin-top: 20px;
        }
        p {
            margin-bottom: 30px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class = "container">
        <h1>Hello!</h1>
        <p>We received a request to reset the password on your Rekruitt Account. Please use the pin below to complete the process.</p>
        <h3>Your reset pin is ${mailPayload.pin}</h3>
        <p>Thank you for helping us keep your account secure!</p>

    </div>
</body>
</html>`;
    const msg = {
        to : mailPayload.to,
        from: "joshuatobiajagbe@gmail.com",
        subject: mailPayload.subject,
        html: textMail
    };
    sgMail
    .send(msg)
    .then((response)=>{
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    })
    .catch ((error)=>{
        console.error(error);
    });
};
module.exports ={
    sendForgotPasswordMail
};
