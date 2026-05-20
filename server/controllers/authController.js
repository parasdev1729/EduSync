const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/mailer');

// Generate Tokens
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// In-memory OTP store: email -> { otp, expiresAt }
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { userId, password, role } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (user && (await user.matchPassword(password))) {
            // Check if role matches
            if (role && user.role !== role) {
                return res.status(401).json({ message: 'Unauthorized role' });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    userId: user.userId,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid user ID or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (uses cookie)
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(decoded.id);
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, refresh token failed' });
    }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Send OTP to user's registered email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log('Forgot password request for:', email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(404).json({ message: 'No user found with this email address.' });
        }

        const genericResponse = { message: 'OTP has been sent to your email.' };

        const otp = generateOtp();
        const expiresAt = Date.now() + OTP_TTL_MS;
        console.log('Generated OTP:', otp);

        // Overwrite any existing OTP for this email
        otpStore.set(user.email, { otp, expiresAt });

        // Auto-clean after TTL
        setTimeout(() => {
            const entry = otpStore.get(user.email);
            if (entry && entry.expiresAt === expiresAt) {
                otpStore.delete(user.email);
            }
        }, OTP_TTL_MS);

        console.log('Attempting to send email to:', user.email);
        await sendOtpEmail(user.email, otp, user.name);
        console.log('Email sent successfully');

        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error('CRITICAL: forgotPassword error:', error);
        res.status(500).json({ message: 'Failed to send OTP. ' + error.message });
    }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (
        newPassword.length < 8 || 
        !/[a-z]/.test(newPassword) || 
        !/[A-Z]/.test(newPassword) || 
        !/[0-9]/.test(newPassword) || 
        !/[^A-Za-z0-9]/.test(newPassword)
    ) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const record = otpStore.get(normalizedEmail);

        if (!record) {
            return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        if (record.otp !== String(otp).trim()) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password — the pre-save hook in User.js will hash it
        user.password = newPassword;
        await user.save();

        // Clear OTP after successful reset
        otpStore.delete(normalizedEmail);

        return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('resetPassword error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

module.exports = { login, refreshToken, logout, forgotPassword, resetPassword };

