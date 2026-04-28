const { authorize } = require('../middleware/authMiddleware');

const reproAuthorize = async () => {
    try {
        console.log('Running repro for authorize middleware');

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
            return res;
        };

        const mockNext = () => {
            mockNext.called = true;
        };

        // Test 1: Authorized role
        console.log('Test 1: Authorized role (admin allowed, user is admin)');
        const req1 = { user: { role: 'admin' } };
        const res1 = mockRes();
        const next1 = mockNext;
        next1.called = false;
        
        const middleware = authorize('admin', 'teacher');
        middleware(req1, res1, next1);
        
        if (next1.called) {
            console.log('PASS: Authorized role passed');
        } else {
            console.error('FAIL: Authorized role blocked');
        }

        // Test 2: Unauthorized role
        console.log('Test 2: Unauthorized role (admin/teacher allowed, user is student)');
        const req2 = { user: { role: 'student' } };
        const res2 = mockRes();
        const next2 = mockNext;
        next2.called = false;
        
        middleware(req2, res2, next2);
        
        if (!next2.called && res2.statusCode === 403) {
            console.log('PASS: Unauthorized role blocked with 403');
        } else {
            console.error('FAIL: Unauthorized role should have been blocked with 403', res2.statusCode);
        }

    } catch (error) {
        console.error('Repro failed:', error);
        process.exit(1);
    }
};

reproAuthorize();
