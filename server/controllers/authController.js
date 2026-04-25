const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Generate Tokens
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { enrollmentNo, password } = req.body;

    try {
        const student = await Student.findOne({ enrollmentNo });

        if (student && (await student.matchPassword(password))) {
            const accessToken = generateAccessToken(student._id);
            const refreshToken = generateRefreshToken(student._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                accessToken,
                user: {
                    id: student._id,
                    name: student.name,
                    enrollmentNo: student.enrollmentNo,
                    branch: student.branch,
                    semester: student.semester
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid enrollment number or password' });
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
        sameSite: 'Strict',
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { login, refreshToken, logout };
