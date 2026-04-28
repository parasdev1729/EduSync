const { login } = require('../controllers/authController');
const User = require('../models/User');

// Mock User model
const originalFindOne = User.findOne;
const originalMatchPassword = User.prototype.matchPassword;

const reproLoginRole = async () => {
    try {
        console.log('Running repro with mocked User model');

        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

        const mockUser = {
            _id: 'mock_id',
            userId: 'test_student_login',
            role: 'student',
            name: 'Login Test Student',
            matchPassword: async (pass) => pass === 'password123'
        };

        User.findOne = async ({ userId }) => {
            if (userId === 'test_student_login') return mockUser;
            return null;
        };

        const mockRes = () => {
            const res = {};
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };
            res.json = (data) => {
                res.body = data;
                return res;
            };
            res.cookie = (name, value, options) => {
                res.cookies = res.cookies || {};
                res.cookies[name] = { value, options };
                return res;
            };
            return res;
        };

        // Test 1: Successful login with correct role
        console.log('Test 1: Login with correct role');
        const req1 = {
            body: { userId: 'test_student_login', password: 'password123', role: 'student' }
        };
        const res1 = mockRes();
        await login(req1, res1);
        if (res1.body && res1.body.user && res1.body.user.role === 'student') {
            console.log('PASS: Login successful with correct role');
        } else {
            console.error('FAIL: Login failed with correct role', res1.body);
        }

        // Test 2: Failed login with incorrect role
        console.log('Test 2: Login with incorrect role');
        const req2 = {
            body: { userId: 'test_student_login', password: 'password123', role: 'admin' }
        };
        const res2 = mockRes();
        await login(req2, res2);
        
        // Currently this will FAIL (it will login successfully) because we haven't implemented role check yet.
        if (res2.statusCode === 401 && res2.body.message === 'Unauthorized role') {
            console.log('PASS: Login blocked with incorrect role');
        } else {
            console.error('FAIL: Login should have been blocked with 401 and "Unauthorized role"', res2.statusCode, res2.body);
        }

        // Restore mocks if needed (though process will exit)
        User.findOne = originalFindOne;
    } catch (error) {
        console.error('Repro failed:', error);
        process.exit(1);
    }
};

reproLoginRole();
