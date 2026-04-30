const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get attendance (student gets own, teacher/admin gets specified)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        const { session, studentId } = req.query;
        
        const query = {};
        
        if (req.user.role === 'student') {
            query.studentId = req.user.id;
        } else if (studentId) {
            query.studentId = studentId;
        } else {
            return res.status(400).json({ message: 'studentId query param is required for teachers/admins' });
        }

        if (session) query.session = session;

        const attendance = await Attendance.find(query).populate('studentId', 'name userId branch batch');
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Bulk update attendance for a batch/branch
// @route   POST /api/attendance/bulk
// @access  Private (Teacher)
const bulkUpdateAttendance = async (req, res) => {
    try {
        const { batch, branch, session, subject, studentsPresent } = req.body;

        if (!batch || !branch || !session || !subject || !Array.isArray(studentsPresent)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find all students in this batch and branch
        const students = await User.find({ 
            role: 'student', 
            batch: { $regex: batch, $options: 'i' }, 
            branch: { $regex: branch, $options: 'i' } 
        });

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found for this batch and branch' });
        }

        const bulkOps = students.map(student => {
            const isPresent = studentsPresent.includes(student._id.toString());
            
            return {
                updateOne: {
                    filter: { studentId: student._id, session, subject },
                    update: {
                        $inc: {
                            totalClasses: 1,
                            attended: isPresent ? 1 : 0
                        }
                    },
                    upsert: true
                }
            };
        });

        await Attendance.bulkWrite(bulkOps);

        res.status(200).json({ 
            message: `Attendance updated for ${students.length} students`,
            students: students.map(s => ({ _id: s._id, name: s.name, userId: s.userId }))
        });
    } catch (error) {
        console.error('Bulk attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAttendance, bulkUpdateAttendance };
