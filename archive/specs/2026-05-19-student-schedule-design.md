# Student Schedule Design - 2026-05-19

## Goal
Implement a visual timetable for students (specifically Group G-20) with hover details and Google Calendar integration.

## Scope
- **Frontend:** New `Schedule.jsx` page and components.
- **Data:** Static JSON mapping for Group G-20 schedule.
- **Integration:** "Add to Google Calendar" functionality via URL deep links.

## Design Details

### 1. Data Structure (`client/src/data/timetableData.js`)
Static array of objects defining the weekly schedule.
- **Subjects:** 
  - `DS OOPS` (Data Structures & OOPs)
  - `Discrete` (Discrete Mathematics)
  - `Linux` (formerly LN)
  - `Computer Networks` (CN)
  - `Backend Engineering` (formerly BEE)
- **Time Slots:**
  1. 16:10 - 17:00
  2. 17:00 - 17:50
  3. 17:50 - 18:40
  4. 18:40 - 19:30
  - *Break: 19:30 - 19:50*
  5. 19:50 - 20:40
  6. 20:40 - 21:30

### 2. User Interface (`client/src/pages/Schedule.jsx`)
- **Grid Layout:** A responsive CSS grid/table showing days (Mon-Fri) vs Time Slots.
- **Hover Interaction:** Tooltip or popover showing:
    - Teacher Name (e.g., Dr. SK, Dr. TR, MT2)
    - Room Number (TG-210)
    - Full Subject Name
- **Visuals:** Modern EduSync aesthetic (dark mode, blue highlights, consistent spacing).

### 3. Google Calendar Integration
- **Button:** "Sync to Google Calendar"
- **Mechanism:** Generates a Google Calendar `TEMPLATE` URL.
- **Payload:** Sets event title, location (Room TG-210), description (Teacher name), and recurrence rule (Weekly).

## Success Criteria
- Students can view their weekly schedule at `/schedule`.
- Hovering over a class shows detailed info.
- Clicking the sync button opens Google Calendar with pre-filled event details for the recurring weekly schedule.

## Technical Notes
- No backend changes required for this phase (static implementation).
- Uses `lucide-react` for icons and standard Tailwind/CSS for styling.
