# Student Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a visual timetable for students with hover details and Google Calendar integration.

**Architecture:** Create a static data source for the G-20 schedule, a helper utility for generating Google Calendar URLs, and a responsive React component for the grid-based timetable.

**Tech Stack:** React, Tailwind CSS, Lucide React (Icons).

---

### Task 1: Schedule Data Structure

**Files:**
- Create: `client/src/data/timetableData.js`

- [ ] **Step 1: Define the timetable data for Group G-20**

```javascript
export const TIME_SLOTS = [
  { id: 1, label: '1', time: '4:10-5:00', start: '16:10', end: '17:00' },
  { id: 2, label: '2', time: '5:00-5:50', start: '17:00', end: '17:50' },
  { id: 3, label: '3', time: '5:50-6:40', start: '17:50', end: '18:40' },
  { id: 4, label: '4', time: '6:40-7:30', start: '18:40', end: '19:30' },
  { id: 'break', label: 'Break', time: '7:30-7:50', start: '19:30', end: '19:50' },
  { id: 5, label: '5', time: '7:50-8:40', start: '19:50', end: '20:40' },
  { id: 6, label: '6', time: '8:40-9:30', start: '20:40', end: '21:30' },
];

export const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr'];

export const TIMETABLE = {
  'Mo': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    4: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'Tu': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'We': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
    6: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
  },
  'Th': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Backend Engineering', teacher: 'Dr. TR / MT1', room: 'TG-210' },
    4: { subject: 'Backend Engineering', teacher: 'Dr. TR / MT1', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'Fr': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Backend Engineering', teacher: 'MT1', room: 'TG-210' },
    4: { subject: 'Backend Engineering', teacher: 'MT1', room: 'TG-210' },
    5: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    6: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add client/src/data/timetableData.js
git commit -m "feat: add static timetable data for G-20"
```

---

### Task 2: Google Calendar Helper

**Files:**
- Create: `client/src/utils/calendarHelper.js`

- [ ] **Step 1: Implement the calendar URL generator**

```javascript
export const generateGoogleCalendarUrl = (classData, day, timeSlot) => {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  
  // Mapping days to RRULE format
  const dayMap = { 'Mo': 'MO', 'Tu': 'TU', 'We': 'WE', 'Th': 'TH', 'Fr': 'FR' };
  
  // Hardcoded date for the start of the semester (example: Monday, May 18, 2026)
  // We'll use a generic start date to establish the recurring pattern
  const startDate = '20260518'; 
  const startTime = timeSlot.start.replace(':', '') + '00';
  const endTime = timeSlot.end.replace(':', '') + '00';
  
  const text = encodeURIComponent(`EduSync: ${classData.subject}`);
  const details = encodeURIComponent(`Teacher: ${classData.teacher}\nRoom: ${classData.room}`);
  const location = encodeURIComponent(classData.room);
  
  // Recurrence rule: Weekly on the specific day
  const recur = encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]}`);
  
  // Construct the dates parameter (YYYYMMDDTHHmmSSZ)
  // Using 'Z' for UTC or omitting it for floating time (user's local)
  const dates = `${startDate}T${startTime}00/${startDate}T${endTime}00`;
  
  return `${baseUrl}&text=${text}&details=${details}&location=${location}&dates=${dates}&recur=${recur}`;
};
```

- [ ] **Step 2: Commit**

```bash
git add client/src/utils/calendarHelper.js
git commit -m "feat: add google calendar deep link utility"
```

---

### Task 3: Schedule Page Component

**Files:**
- Create: `client/src/pages/Schedule.jsx`
- Modify: `client/src/App.jsx` (Register Route)

- [ ] **Step 1: Create the Schedule page with grid and hover effects**

```jsx
import React from 'react';
import { Calendar, Clock, MapPin, User, ExternalLink } from 'lucide-react';
import { TIME_SLOTS, DAYS, TIMETABLE } from '../data/timetableData';
import { generateGoogleCalendarUrl } from '../utils/calendarHelper';

const Schedule = () => {
  return (
    <div className="p-6 bg-[#020617] min-h-screen text-slate-300">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">My Schedule</h1>
          <p className="text-slate-500 font-medium">Group G-20 | 2nd Year CSE</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <Calendar size={14} />
          <span>Semester 4</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-slate-500 w-24">Day / Slot</th>
              {TIME_SLOTS.map(slot => (
                <th key={slot.id} className="p-4 border-b border-r border-white/10 bg-white/[0.03] text-center min-w-[120px]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">{slot.label}</div>
                  <div className="text-[9px] font-bold text-slate-600 mt-1">{slot.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="p-4 border-b border-r border-white/10 bg-white/[0.01] text-sm font-black text-white text-center">{day}</td>
                {TIME_SLOTS.map(slot => {
                  const classInfo = TIMETABLE[day][slot.id];
                  if (slot.id === 'break') {
                    return (
                      <td key={slot.id} className="p-4 border-b border-r border-white/10 bg-slate-900/50 text-center italic text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                        Break
                      </td>
                    );
                  }
                  return (
                    <td key={slot.id} className="p-1 border-b border-r border-white/10 relative group">
                      {classInfo ? (
                        <div className="h-full w-full p-3 rounded-xl transition-all group-hover:bg-blue-600/10 cursor-help">
                          <div className="text-[11px] font-black text-white leading-tight">{classInfo.subject}</div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-4 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl pointer-events-none">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <User size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-slate-300">{classInfo.teacher}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-slate-300">{classInfo.room}</span>
                              </div>
                              <div className="pt-2 border-t border-white/5">
                                <a 
                                  href={generateGoogleCalendarUrl(classInfo, day, slot)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest text-white pointer-events-auto hover:bg-blue-500 transition-colors"
                                >
                                  <ExternalLink size={10} />
                                  <span>Add to Calendar</span>
                                </a>
                              </div>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#0f172a]"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full min-h-[60px]"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl flex items-start space-x-4">
        <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Calendar Sync</h3>
          <p className="text-xs font-medium text-slate-500 max-w-lg">
            Hover over any class slot to see teacher details and click the button to sync that recurring lecture to your Google Calendar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
```

- [ ] **Step 2: Update App.jsx with the new route**

```jsx
// Import the new page (around line 15)
import Schedule from './pages/Schedule';

// Add the route inside ProtectedRoute (around line 50)
<Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Schedule.jsx client/src/App.jsx
git commit -m "feat: implement visual schedule page with calendar integration"
```

---

### Task 4: Sidebar Navigation

**Files:**
- Modify: `client/src/components/Sidebar.jsx`

- [ ] **Step 1: Add Schedule to the student sidebar navigation**

```jsx
// Locate the navigation items array for students
// Add the following object:
{ 
  name: 'Schedule', 
  path: '/schedule', 
  icon: Calendar, 
  roles: ['student'] 
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Sidebar.jsx
git commit -m "feat: add schedule link to student sidebar"
```
