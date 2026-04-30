const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Circular = require('../models/Circular');

dotenv.config({ path: path.join(__dirname, '../.env') });

const newCirculars = [
  {
    title: "Summer Internship Opportunity - Google Step",
    description: "Applications are open for the Google STEP internship 2026. Interested students of 2nd and 3rd year can apply through the official portal. Deadline: May 15, 2026.",
    issuedBy: "Placement Cell",
    fileUrl: "https://www.google.com/about/careers/applications/students/",
    date: new Date('2026-04-20')
  },
  {
    title: "End Semester Examination Schedule - June 2026",
    description: "The tentative datesheet for the upcoming End Semester Examinations has been released. Please check the university website for detailed subject-wise slots.",
    issuedBy: "Examination Controller",
    fileUrl: "https://example.com/datesheet_june_2026.pdf",
    date: new Date('2026-04-22')
  },
  {
    title: "Annual Cultural Fest 'Euphoria' Registration",
    description: "Registrations for various events in Euphoria 2026 are now open. Technical, cultural, and sports events are included. Grab your slots now!",
    issuedBy: "Student Council",
    fileUrl: "https://example.com/euphoria_reg",
    date: new Date('2026-04-23')
  },
  {
    title: "Workshop on Generative AI and LLMs",
    description: "A two-day hands-on workshop on building applications using Gemini API and LangChain. Registration mandatory for CS students.",
    issuedBy: "CS Department",
    fileUrl: "",
    date: new Date('2026-04-24')
  }
];

const seedMoreCirculars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await Circular.insertMany(newCirculars);
    console.log('Successfully added more circulars!');

    process.exit();
  } catch (error) {
    console.error('Error seeding circulars:', error.message);
    process.exit(1);
  }
};

seedMoreCirculars();
