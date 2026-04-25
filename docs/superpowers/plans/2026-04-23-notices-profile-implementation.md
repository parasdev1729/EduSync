# Notices & Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Circulars, Activities, and Profile pages for the EduSync dashboard.

**Architecture:** React components using Axios for data fetching and Tailwind CSS v4 for styling.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React, Axios.

---

### Task 1: Create Circulars Page

**Files:**
- Create: `client/src/pages/Circulars.jsx`

- [ ] **Step 1: Implement Circulars.jsx**

```jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Download, Calendar, Loader2, AlertCircle } from 'lucide-react';

const Circulars = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const response = await api.get('/circulars');
        // Sort by date newest first
        const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCirculars(sortedData);
      } catch (err) {
        console.error('Error fetching circulars:', err);
        setError('Failed to load circulars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-red-600 text-center">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">University Circulars</h1>
        <p className="text-gray-500">Stay updated with the latest official announcements.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {circulars.length > 0 ? (
          circulars.map((circular) => (
            <div 
              key={circular._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">{circular.title}</h3>
                    <p className="text-sm font-medium text-blue-800 bg-blue-50 inline-block px-2 py-0.5 rounded">
                      Issued by: {circular.issuedBy}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 pt-1">
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(circular.date).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                {circular.fileUrl && (
                  <a 
                    href={circular.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {circular.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No circulars found at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circulars;
```

- [ ] **Step 2: Commit Circulars.jsx**

```bash
git add client/src/pages/Circulars.jsx
git commit -m "feat: implement Circulars page with card-based feed"
```

---

### Task 2: Create Activities Page

**Files:**
- Create: `client/src/pages/Activities.jsx`

- [ ] **Step 1: Implement Activities.jsx**

```jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, MapPin, ExternalLink, Loader2, AlertCircle, Zap } from 'lucide-react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/activities');
        // Sort by date (upcoming first)
        const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setActivities(sortedData);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-red-600 text-center">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Activities</h1>
        <p className="text-gray-500">Discover and register for campus events and workshops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Zap size={20} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    Event
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {activity.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">
                      {new Date(activity.date).toLocaleDateString('en-GB', { 
                        weekday: 'short',
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">{activity.venue}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                {activity.registrationLink ? (
                  <a 
                    href={activity.registrationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    <span>Register Now</span>
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic font-medium">No registration required</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No upcoming activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
```

- [ ] **Step 2: Commit Activities.jsx**

```bash
git add client/src/pages/Activities.jsx
git commit -m "feat: implement Activities page with grid-based event cards"
```

---

### Task 3: Create My Info Page

**Files:**
- Create: `client/src/pages/MyInfo.jsx`

- [ ] **Step 1: Implement MyInfo.jsx**

```jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Hash, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const MyInfo = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await api.get('/student/me');
        setStudent(response.data);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-900" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-red-600 text-center">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Profile Error</h2>
        <p className="max-w-md">{error || 'Could not retrieve profile data.'}</p>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="p-2 bg-white rounded-md text-blue-600 shadow-sm mr-4">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-gray-900 font-bold">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="h-32 bg-blue-900 relative">
          <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg">
            <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 border-4 border-white">
              {student.profilePic ? (
                <img 
                  src={student.profilePic} 
                  alt={student.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={64} />
              )}
            </div>
          </div>
        </div>

        {/* Profile Basic Info */}
        <div className="pt-20 pb-8 px-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{student.name}</h1>
              <p className="text-blue-700 font-medium flex items-center mt-1">
                <GraduationCap size={18} className="mr-2" />
                {student.branch} • Semester {student.semester}
              </p>
            </div>
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-100">
              <ShieldCheck size={16} className="mr-1.5" />
              Verified Account
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
            Academic & Personal Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              icon={Hash} 
              label="Enrollment Number" 
              value={student.enrollmentNo} 
            />
            <InfoItem 
              icon={Mail} 
              label="University Email" 
              value={student.email} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Section" 
              value={student.section} 
            />
            <InfoItem 
              icon={Calendar} 
              label="Date of Birth" 
              value={new Date(student.dob).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })} 
            />
            <InfoItem 
              icon={Phone} 
              label="Contact Number" 
              value={student.phone} 
            />
            <InfoItem 
              icon={GraduationCap} 
              label="Academic Program" 
              value="Bachelor of Engineering" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
```

- [ ] **Step 2: Commit MyInfo.jsx**

```bash
git add client/src/pages/MyInfo.jsx
git commit -m "feat: implement MyInfo profile page with detailed grid layout"
```

---

### Task 4: Update App.jsx Integration

**Files:**
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Update Imports and Routes in App.jsx**

```jsx
// Find existing imports and update them
import Circulars from './pages/Circulars';
import Activities from './pages/Activities';
import MyInfo from './pages/MyInfo';

// Update the AppRoutes component to use actual components instead of placeholders
```

- [ ] **Step 2: Apply changes to App.jsx**

- [ ] **Step 3: Commit App.jsx changes**

```bash
git add client/src/App.jsx
git commit -m "feat: integrate Circulars, Activities, and MyInfo pages into main routes"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run build to check for errors**

Run: `npm run build` in `client/` directory.
Expected: Build finishes successfully without syntax or type errors.

- [ ] **Step 2: Final Commit**

```bash
git commit --allow-empty -m "final: notices and profile implementation complete"
```
