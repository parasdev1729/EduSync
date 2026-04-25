require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Circular = require('../models/Circular');
const Activity = require('../models/Activity');
const connectDB = require('../config/db');

const seedData = async () => {
    try {
        await connectDB();

        // Drop existing collections
        await Student.deleteMany();
        await Attendance.deleteMany();
        await Marks.deleteMany();
        await Circular.deleteMany();
        await Activity.deleteMany();

        console.log('Collections cleared');

        // Create Students
        const studentsData = [
            {
                enrollmentNo: "2410991556",
                password: "student123",
                email: "paras1556.becse24@chitkara.edu.in",
                name: "Paras Rana",
                branch: "CSE",
                semester: 4,
                section: "CS-A",
                phone: "9876543210",
                dob: new Date("2006-04-01")
            },
            {
                enrollmentNo: "2410991557",
                password: "student456",
                email: "student1557.becse24@chitkara.edu.in",
                name: "John Doe",
                branch: "CSE",
                semester: 4,
                section: "CS-B",
                phone: "0987654321",
                dob: new Date("2006-05-15")
            }
        ];

        const students = await Student.create(studentsData);
        console.log('Students seeded');

        const subjects = [
            { name: "Data Structures", credits: 4 },
            { name: "Operating Systems", credits: 4 },
            { name: "Computer Networks", credits: 4 },
            { name: "Database Management", credits: 3 },
            { name: "Discrete Math", credits: 4 },
            { name: "Software Engineering", credits: 3 }
        ];
        const sessions = ["JulDec2024", "JanJun2025", "JulDec2025", "JanJun2026"];

        for (const student of students) {
            for (const session of sessions) {
                // Seed Attendance
                const attendanceRecords = subjects.map(sub => ({
                    studentId: student._id,
                    session,
                    subject: sub.name,
                    totalClasses: 45,
                    attended: Math.floor(Math.random() * 11) + 34 // 34-44 attended
                }));
                await Attendance.insertMany(attendanceRecords);

                // Seed Marks
                const marksRecords = [];
                subjects.forEach(sub => {
                    // MST1
                    marksRecords.push({
                        studentId: student._id,
                        session,
                        subject: sub.name,
                        examType: "MST1",
                        marksObtained: Math.floor(Math.random() * 16) + 30, // 30-45
                        maxMarks: 50,
                        credits: sub.credits
                    });
                    // MST2
                    marksRecords.push({
                        studentId: student._id,
                        session,
                        subject: sub.name,
                        examType: "MST2",
                        marksObtained: Math.floor(Math.random() * 16) + 32, // 32-47
                        maxMarks: 50,
                        credits: sub.credits
                    });
                    // EndSem
                    marksRecords.push({
                        studentId: student._id,
                        session,
                        subject: sub.name,
                        examType: "EndSem",
                        marksObtained: Math.floor(Math.random() * 31) + 65, // 65-95
                        maxMarks: 100,
                        credits: sub.credits
                    });
                });
                await Marks.insertMany(marksRecords);
            }
        }

        console.log('Attendance and Marks seeded for 4 sessions');

        // Seed Circulars
        const circulars = [
            { title: "MST1 Schedule - Even Semester", description: "MST1 will start from 15th March. Check timetable for details.", issuedBy: "Examination Branch", date: new Date("2026-03-01") },
            { title: "Holi Holiday Notice", description: "University will remain closed on 25th March for Holi celebrations.", issuedBy: "Admin", date: new Date("2026-03-20") },
            { title: "Fee Submission Reminder", description: "Last date to pay the current semester fee is 31st March to avoid fine.", issuedBy: "Accounts Department", date: new Date("2026-03-25") },
            { title: "Hackathon 2026 Registration", description: "Participate in the 24-hour national level hackathon. Win prizes worth 1 Lakh.", issuedBy: "Tech Club", date: new Date("2026-04-05") },
            { title: "Summer Internship Program", description: "Registration open for summer internships at top tech firms. Check Placement Portal.", issuedBy: "Placement Cell", date: new Date("2026-04-10") }
        ];
        await Circular.insertMany(circulars);

        // Seed Activities
        const activities = [
            { title: "Code Quest 2026", description: "A competitive programming challenge for all years.", date: new Date("2026-04-30"), venue: "Newton Hall", registrationLink: "https://example.com/register-cq" },
            { title: "Inter-departmental Football Finals", description: "Come support CSE team in the finals against Mechanical.", date: new Date("2026-05-02"), venue: "University Main Ground", registrationLink: "" },
            { title: "Tech Talk: Generative AI", description: "Expert session on LLMs and the future of work.", date: new Date("2026-05-10"), venue: "Exploret", registrationLink: "https://example.com/register-tt" }
        ];
        await Activity.insertMany(activities);

        console.log('Circulars and Activities seeded');
        console.log('Seeding completed successfully');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
