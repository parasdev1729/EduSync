# EduSync - Notices & Profile Design Spec

**Date:** 2026-04-23  
**Status:** Approved  
**Topic:** Implementation of Circulars, Activities, and Profile pages.

## 🎯 Overview
Implementation of the final three pages for the EduSync student dashboard: Circulars, Activities, and MyInfo (Profile). These pages will provide students with university updates, event information, and their personal records.

## 🏗️ Components

### 1. Circulars Page (`Circulars.jsx`)
- **Purpose:** Display university-wide official notices.
- **Data Source:** `GET /api/circulars`
- **Fields:** Title, Description, Issued By, Date, File URL (Download).
- **Layout:** Vertical stack of cards with sorting by date (newest first).
- **Icons:** `FileText` (card icon), `Download` (action), `Calendar` (date).

### 2. Activities Page (`Activities.jsx`)
- **Purpose:** Display upcoming university events and activities.
- **Data Source:** `GET /api/activities`
- **Fields:** Title, Description, Date, Venue, Registration Link.
- **Layout:** Responsive grid of cards.
- **Icons:** `Calendar` (date), `MapPin` (venue), `ExternalLink` (registration).

### 3. My Info Page (`MyInfo.jsx`)
- **Purpose:** Show detailed student profile information.
- **Data Source:** `GET /api/student/me`
- **Fields:** Name, Enrollment No, Email, Branch, Semester, Section, DOB, Phone.
- **Layout:** 
    - Profile Header with Name and placeholder avatar.
    - Information Grid: 2-column layout (Left: Label, Right: Value) for better readability.
- **Icons:** `User`, `Mail`, `Phone`, `MapPin`, `GraduationCap`.

## 🎨 Styling
- **Tailwind CSS v4:** Using utility classes for responsive design, shadows, and spacing.
- **Card Design:** White background, subtle gray border (`border-gray-100`), medium shadow on hover.
- **Typography:** Bold titles, slate-colored secondary text.

## 🔄 Integration
- Update `client/src/App.jsx` to import and mount these components at their respective routes:
    - `/circulars` -> `Circulars.jsx`
    - `/activities` -> `Activities.jsx`
    - `/profile` -> `MyInfo.jsx`

## ✅ Success Criteria
- Data is correctly fetched from the backend.
- UI matches the "Performance Hub" aesthetic.
- Download and Registration links work as expected (or handle empty states).
- Profile page shows all relevant student fields correctly.
