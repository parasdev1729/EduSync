# EduSync - University Student Dashboard Design

**Date:** 2026-04-23  
**Status:** Draft  
**Topic:** Full-stack Student Portal Implementation  

## 🎯 Project Overview
EduSync is a comprehensive university student dashboard designed for high visibility into academic performance. It follows a "Performance Hub" approach, combining information-dense tables with interactive visual analytics.

## 🏗️ Architecture
- **Backend:** Node.js + Express.js (Strict MVC).
- **Frontend:** React 19 (Vite) + Tailwind CSS v4 + Recharts.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JWT (Access + Refresh Token pattern) with `httpOnly` cookies for the refresh token.

## 📁 System Components

### 1. Backend (MVC)
- **Models:**
    - `Student`: Enrollment, email, hashed password, profile info.
    - `Attendance`: Subject-wise counts per session (`JanJun2026`, `JulDec2026`).
    - `Marks`: Subject-wise scores per exam type (MST1, MST2, EndSem) and session.
    - `Circular`: Global university notices.
    - `Activity`: Global event listings.
- **Controllers:** Decoupled handlers for Auth, Student info, Attendance, Marks, Circulars, and Activities.
- **Middleware:** `authMiddleware.js` for JWT verification.

### 2. Frontend (Performance Hub)
- **AuthContext:** Manages login state and user info.
- **Axios Instance:** Centralized API calls with interceptors for 401 token refresh.
- **Pages:**
    - **Dashboard:** Welcome stats + Recharts LineChart for mark trends + quick circulars feed.
    - **Attendance:** Session selector + RadialBarChart (overall %) + Detailed data table (Subject, Attended, Total, %).
    - **Marks:** Session/Exam selector + BarChart (Subject vs Marks) + Detailed data table.
    - **Circulars/Activities:** List-based views with download/registration actions.
    - **MyInfo:** Detailed profile view.

## 🔐 Authentication Flow
1. `POST /api/auth/login` -> Returns Access Token (15m) + Sets `refreshToken` Cookie (httpOnly, Secure).
2. `POST /api/auth/refresh` -> Uses cookie to issue new Access Token.
3. `POST /api/auth/logout` -> Clears the `refreshToken` cookie.
4. Client-side Axios interceptor catches 401s and attempts to refresh before failing the request.

## 🌱 Seeding Strategy (`seedStudents.js`)
- Clears all collections on run.
- Seeds 2 students with realistic data (e.g., `24100991556`, `paras.becse24@chitkara.edu.in`).
- Populates `JanJun2026` and `JulDec2026` sessions with attendance and marks.
- Seeds 5+ circulars and 3+ activities.

## 🎨 Visual Identity
- **Palette:** Navy Primary (#1e3a8a), Slate Neutrals, Success Green (>75% attendance), Danger Red (<75%).
- **Components:** Tailwind-styled cards with subtle shadows and rounded corners.
- **Interactive:** Recharts for data visualization on Dashboard, Attendance, and Marks pages.

## ✅ Success Criteria
- Secure authentication with token persistence.
- Session-based filtering for Attendance and Marks.
- Fully functional "Performance Hub" UI with interactive charts.
- Robust seeding script for local development.
