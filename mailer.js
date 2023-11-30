const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'edt@pulsipher.org',
        pass: 'july2711'
    }
});

const mailOptions = {
    from: 'edt@pulsipher.org',
    to: 'darren@pulsipher.org',
    subject: 'Test Email',
    text: "Email Content"
}

transporter.sendMail(mailOptions, function(error, info){
    if(error) {
        console.error(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
