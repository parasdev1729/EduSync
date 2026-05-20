const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a password-reset OTP to the given email address.
 * @param {string} to   - Recipient email
 * @param {string} otp  - 6-digit OTP string
 * @param {string} name - Recipient's name for personalization
 */
const sendOtpEmail = async (to, otp, name) => {
    const mailOptions = {
        from: `"EduSync Portal" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'EduSync — Password Reset OTP',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px 40px;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #fff;">EduSync Portal</h1>
                <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.8; color: #bfdbfe;">Password Reset Request</p>
            </div>
            <div style="padding: 40px;">
                <p style="margin: 0 0 8px; font-size: 15px; color: #94a3b8;">Hi <strong style="color: #e2e8f0;">${name}</strong>,</p>
                <p style="margin: 0 0 28px; font-size: 14px; color: #64748b; line-height: 1.6;">
                    We received a request to reset your EduSync password. Use the OTP below — it expires in <strong style="color: #f59e0b;">10 minutes</strong>.
                </p>
                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px;">
                    <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #475569;">Your OTP</p>
                    <p style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #3b82f6; font-family: monospace;">${otp}</p>
                </div>
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.6;">
                    If you did not request this, you can safely ignore this email. Your password will not change.
                </p>
            </div>
            <div style="border-top: 1px solid #1e293b; padding: 20px 40px;">
                <p style="margin: 0; font-size: 11px; color: #334155; text-align: center; text-transform: uppercase; letter-spacing: 0.15em;">Chitkara University · EduSync</p>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
