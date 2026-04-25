# EduSync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete university student dashboard with visual analytics and secure auth.

**Architecture:** MVC backend (Express/MongoDB) and React 19 frontend with Recharts and Tailwind v4. Uses JWT Access/Refresh token pattern.

**Tech Stack:** Node.js, Express, MongoDB, React 19, Tailwind CSS v4, Recharts, Axios.

---

### Milestone 1: Backend Core & Auth

#### Task 1: Project Initialization & Express Setup
- [ ] Create `server/` directory and initialize `package.json`
- [ ] Install dependencies: `express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs`
- [ ] Create `server/.env` with placeholders for `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `PORT=5000`
- [ ] Create `server/config/db.js` for MongoDB connection
- [ ] Create `server/index.js` with basic Express setup, middleware (CORS, JSON, cookie-parser), and DB connection
- [ ] Verify server starts with `node index.js`

#### Task 2: Auth Middleware & Models
- [ ] Create `server/models/Student.js` (enrollmentNo, password, email, etc.)
- [ ] Create `server/middleware/authMiddleware.js` to verify JWT and attach `req.user`
- [ ] Create `server/controllers/authController.js` with `login`, `refreshToken`, and `logout` logic
- [ ] Create `server/routes/authRoutes.js` and mount in `index.js`

### Milestone 2: Data & Seeding

#### Task 3: Domain Models & Seeding Script
- [ ] Create `server/models/Attendance.js`, `Marks.js`, `Circular.js`, `Activity.js`
- [ ] Create `server/seed/seedStudents.js`
- [ ] Implement seeding logic: drop collections, hash passwords, insert 2 students and their related data for `JanJun2026` and `JulDec2026`
- [ ] Run `node seed/seedStudents.js` and verify data in MongoDB

### Milestone 3: Feature APIs

#### Task 4: Student & Data Controllers
- [ ] Create controllers for `student`, `attendance`, `marks`, `circular`, and `activity`
- [ ] Implement filtering by `studentId` and `session` (for attendance/marks)
- [ ] Create routes for each and mount them in `index.js` under `/api` prefix
- [ ] Test endpoints using `curl` or a REST client (login -> get token -> fetch attendance)

### Milestone 4: Frontend Foundation

#### Task 5: React Setup & Styling
- [ ] Scaffold `client/` using `npm create vite@latest . -- --template react`
- [ ] Install dependencies: `axios react-router-dom lucide-react recharts`
- [ ] Install Tailwind CSS v4
- [ ] Configure `client/vite.config.js` to proxy `/api` to `http://localhost:5000`
- [ ] Create `client/src/api/axios.js` with interceptor for 401 token refresh

#### Task 6: Auth Context & Protected Routing
- [ ] Create `client/src/context/AuthContext.jsx` to manage user state and tokens
- [ ] Create `client/src/components/ProtectedRoute.jsx`
- [ ] Setup `client/src/App.jsx` with basic routes for Login and Dashboard

### Milestone 5: Dashboard & Visuals

#### Task 7: Layout & Dashboard Page
- [ ] Create `Navbar.jsx` and `Sidebar.jsx` with navigation links
- [ ] Implement `Login.jsx` with form handling
- [ ] Implement `Dashboard.jsx` with welcome card, quick stats, and Recharts `LineChart` for marks trend

#### Task 8: Data Pages (Attendance & Marks)
- [ ] Implement `Attendance.jsx` with session selector, overall `RadialBarChart`, and detailed table
- [ ] Implement `Marks.jsx` with session/exam selector, `BarChart`, and detailed table

#### Task 9: Notices & Profile
- [ ] Implement `Circulars.jsx` and `Activities.jsx` as card-based feeds
- [ ] Implement `MyInfo.jsx` profile view
- [ ] Add final polish, error handling, and `README.md`
