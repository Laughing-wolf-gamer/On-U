import nodemailer from 'nodemailer';

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email provider (Gmail, SendGrid, etc.)
    secure: false,
    port:8000,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    },
});

// Controller to send email verification
export const sendVerificationEmail = (email, otp) => {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Email OTP Verification',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`
        // Uncomment and customize if using a verification link:
        // html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // Handle error: you could return a response here in an API
            console.error("Error sending email: ", error.message);
        } else {
            console.log('Verification email sent successfully:', info);
        }
    });
};
