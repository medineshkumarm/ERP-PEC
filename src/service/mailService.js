const nodemailer = require('nodemailer');

// Create a transporter object using your email service configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service (e.g., Gmail, Outlook)
    auth: {
        user: 'msdmrdk@gmail.com',
        pass: 'eabfvfuxvamrryxa',   // Your email password or application-specific password
    }
});

// Function to send an email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'msdmrdk@gmail.com', // Sender address
        to: to,                       // List of recipients
        subject: subject,             // Subject line
        text: text                    // Plain text body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
