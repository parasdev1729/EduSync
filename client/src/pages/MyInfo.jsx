import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, User, Mail, Phone, Book, Hash, Calendar, ShieldCheck } from 'lucide-react';

const MyInfo = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/student/me');
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  const infoItems = [
    { label: 'Full Name', value: student?.name, icon: <User size={20} /> },
    { label: 'Enrollment No', value: student?.enrollmentNo, icon: <Hash size={20} /> },
    { label: 'University Email', value: student?.email, icon: <Mail size={20} /> },
    { label: 'Mobile Number', value: student?.phone, icon: <Phone size={20} /> },
    { label: 'Department / Branch', value: student?.branch, icon: <Book size={20} /> },
    { label: 'Current Semester', value: `Semester ${student?.semester}`, icon: <ShieldCheck size={20} /> },
    { label: 'Section', value: student?.section, icon: <ShieldCheck size={20} /> },
    { label: 'Date of Birth', value: new Date(student?.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: <Calendar size={20} /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">My Profile</h1>
        <p className="text-slate-400">View and verify your personal and academic information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-blue-400 overflow-hidden shadow-inner">
              {student?.profilePic ? (
                <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <User size={64} />
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-6">{student?.name}</h2>
          <p className="text-blue-400 font-semibold">{student?.branch} | B.E.</p>
          <div className="mt-6 w-full pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="px-2.5 py-0.5 bg-emerald-900/30 text-emerald-400 rounded-full text-xs font-bold border border-emerald-800/50">Active Student</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Batch</span>
              <span className="text-slate-300 font-bold">2024 - 2028</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 mb-8 flex items-center">
            <ShieldCheck size={20} className="mr-2 text-blue-400" />
            General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {infoItems.map((item, idx) => (
              <div key={idx} className="group">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">{item.label}</p>
                <div className="flex items-center text-slate-200">
                  <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-400 group-hover:text-blue-400 transition-colors border border-slate-700">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-lg">{item.value || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
