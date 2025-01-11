import nodemailer from 'nodemailer';
import User from '../model/usermodel.js';
import { promisify } from 'util';


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

const sendMailAsync = promisify(transporter.sendMail.bind(transporter));

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

export const sendCouponMail = async (fullName, toEmail, couponCode) => {
    let sendingEmailSuccess = false;
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: toEmail,
        subject: 'Your Exclusive Coupon Code!',
        text: `${fullName},\n\nWe’re excited to offer you an exclusive coupon code! Use the code below to save on your next purchase.\n\nCoupon Code: ${couponCode}\n\nHurry, it’s valid for a limited time! Don’t miss out on this special offer.\n\nThank you for being a valued customer!`,
        html: `
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>We’re excited to offer you an exclusive coupon code! Use the code below to save on your next purchase:</p>
            <p><strong>Coupon Code: ${couponCode}</strong></p>
            <p><em>Hurry, it’s valid for a limited time! Don’t miss out on this special offer.</em></p>
            <p>Thank you for being a valued customer. We appreciate your support!</p>
            <p>Best regards,</p>
            <p>Your ON-U Team</p>
        `
    };

    try {
        const info = await sendMailAsync(mailOptions);
        console.log('Coupon email sent successfully:', info);
        sendingEmailSuccess = true;
    } catch (error) {
        console.error('Error sending email: ', error.message);
        sendingEmailSuccess = false;
    }
    return sendingEmailSuccess;
};

export const sendOrderPlacedMail = async (userId,orderData)=>{
    try {
        const userData = await User.findById(userId);
        console.log("order Data",orderData);
        if(!userData){
            console.error("User not found");
            return;
        }
        let message = `
            Dear ${userData.name},

            Thank you for your order! We have successfully processed it. Here are the details:

        `;

        orderData.orderItems.forEach(item => {
            message += `
                Product: ${item.productId.title}
                Size: ${item.size}
                Quantity: ${item.quantity}
                ---------------------------
                `;
        });

        message += `
            We will notify you once your order is shipped.

            Thank you for shopping with us!

            Best regards,
            On-U
        `;
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userData.email,
            subject: 'Order Placed Successfully',
            text: message,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // Handle error: you could return a response here in an API
                console.error("Error sending email: ", error.message);
            } else {
                console.log('Email sent successfully:', info);
            }
        })
    } catch (error) {
        console.error("Error sending message: ", error);
    }
}
