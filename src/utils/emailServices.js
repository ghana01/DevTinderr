import nodemailer from 'nodemailer';

// Configure your email service
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD // Your app password
    }
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'DevTinder - Password Reset Request',
        html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your DevTinder account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};