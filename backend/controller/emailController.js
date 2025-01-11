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
export const sendVerificationEmail = async (email, otp) => {
    let sendingEmailSuccess = false;
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Email OTP Verification',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`
        // Uncomment and customize if using a verification link:
        // html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`
    };
    try {
        const info = await sendMailAsync(mailOptions);
        console.log('email sent successfully:', info);
        sendingEmailSuccess = true;
    } catch (error) {
        console.error('Error sending email: ', error.message);
        sendingEmailSuccess = false;
    }
    return sendingEmailSuccess;

    /* transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // Handle error: you could return a response here in an API
            console.error("Error sending email: ", error.message);
        } else {
            console.log('Verification email sent successfully:', info);
        }
    }); */
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
export const sendUpdateOrderStatus = async(userId, orderData) => {
    let sendingEmailSuccess = false;
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        // Initialize the base message
        let message = `Dear ${userData.name},\n\n`;

        // Handle different order statuses
        switch(orderData?.status) {
            case 'Processing':
                message += `
                Your order is currently being processed. We are preparing your items for shipment.
                Here are the details:
                `;
                break;
            case 'Order Confirmed':
                message += `
                Your order has been confirmed. We are getting ready to ship your items. Here are the details:
                `;
                break;
            case 'Order Shipped':
                message += `
                Great news! Your order has been dispatched and is on its way. Here are the details:
                `;
                break;
            case 'Out for Delivery':
                message += `
                Your order is out for delivery. It should be arriving soon. Here are the details:
                `;
                break;
            case 'Delivered':
                message += `
                Your order has been successfully delivered! We hope you enjoy your purchase. Here are the details:
                `;
                break;
            default:
                message += `
                We have received your order and it is being processed. Here are the details:
                `;
                break;
        }

        // Add order items to the message
        orderData.orderItems.forEach(item => {
            message += `\nProduct: ${item.productId.title}\nSize: ${item.size}\nQuantity: ${item.quantity}\n`;
        });

        // Final message and thank you note
        message += `
            Thank you for shopping with us! We will notify you of any further updates.

            Best regards,
            On-U
        `;

        // Set up the email options
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userData.email,
            subject: `Order Status Update: ${orderData.status}`,
            text: message,
        };
        
        try {
            // Send the email
            const info = await sendMailAsync(mailOptions);
            console.log('Email sent successfully:', info);
            sendingEmailSuccess = true;
        } catch (error) {
            console.error('Error sending email:', error.message);
            sendingEmailSuccess = false;
        }

    } catch (error) {
        console.error("Error:", error);
        sendingEmailSuccess = false;
    }
    
    return sendingEmailSuccess;
}


export const sendOrderPlacedMail = async (userId,orderData)=>{
    let sendingEmailSuccess = false;
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
                Status:${orderData.status}
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
        
        try {
            const info = await sendMailAsync(mailOptions);
            console.log('Coupon email sent successfully:', info);
            sendingEmailSuccess = true;
        } catch (error) {
            console.error('Error sending email: ', error.message);
            sendingEmailSuccess = false;
        }
    } catch (error) {
        console.error("Error sending message: ", error);
        sendingEmailSuccess = false;
    }
    return sendingEmailSuccess;
}
