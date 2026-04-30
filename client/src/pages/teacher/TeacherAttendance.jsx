import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle2, Send, ChevronDown, Users, UserCheck } from 'lucide-react';
import api from '../../api/axios';

const TeacherAttendance = () => {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'bulk'
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const sessions = ["JulDec2024", "JanJun2025", "JulDec2025", "JanJun2026"];
  const [session, setSession] = useState('JanJun2026');
  
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  
  const [updateForm, setUpdateForm] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Bulk state
  const [bulkConfig, setBulkConfig] = useState({
    batch: '',
    branch: '',
    subject: '',
    session: 'JanJun2026'
  });
  const [batchStudents, setBatchStudents] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [presentStudents, setPresentStudents] = useState([]);

  // Mock data for dropdowns (usually these would come from an API)
  const branches = ["CSE", "ECE", "ME", "Civil"];
  const batches = ["Batch 2022", "Batch 2023", "Batch 2024", "Batch 2025"];
  const subjects = ["Data Structures", "Operating Systems", "Computer Networks", "Database Management", "Discrete Math", "Software Engineering"];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const response = await api.get('/users?role=student');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const fetchAttendance = async (studentId, sess) => {
    setLoadingAttendance(true);
    setUpdateForm(null);
    try {
      const response = await api.get(`/attendance?studentId=${studentId}&session=${sess}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (selectedStudent && activeTab === 'individual') {
      fetchAttendance(selectedStudent._id, session);
    }
  }, [selectedStudent, session, activeTab]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.userId.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (record) => {
    setUpdateForm({
      targetId: record._id,
      studentId: record.studentId._id || record.studentId,
      session: record.session,
      subject: record.subject,
      totalClasses: record.totalClasses,
      attended: record.attended
    });
  };

  const handleAddNewClick = () => {
    setUpdateForm({
      targetId: null,
      studentId: selectedStudent._id,
      session,
      subject: '',
      totalClasses: 0,
      attended: 0
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: name === 'subject' ? value : parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post('/requests', {
        type: 'attendance_update',
        targetId: updateForm.targetId,
        payload: {
          studentId: updateForm.studentId,
          session: updateForm.session,
          subject: updateForm.subject,
          totalClasses: updateForm.totalClasses,
          attended: updateForm.attended
        }
      });
      setSuccessMsg(`Attendance update request submitted for admin approval.`);
      setUpdateForm(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Bulk Handlers
  const handleBulkConfigChange = (e) => {
    setBulkConfig({ ...bulkConfig, [e.target.name]: e.target.value });
  };

  const loadBatchStudents = async () => {
    if (!bulkConfig.batch || !bulkConfig.branch) {
      setErrorMsg('Please specify both Batch and Branch');
      return;
    }
    setLoadingBatch(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/users?role=student&batch=${bulkConfig.batch}&branch=${bulkConfig.branch}`);
      setBatchStudents(response.data);
      // Default: Everyone is present
      setPresentStudents(response.data.map(s => s._id));
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load batch students');
    } finally {
      setLoadingBatch(false);
    }
  };

  const toggleStudentPresence = (id) => {
    setPresentStudents(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleBulkSubmit = async () => {
    if (!bulkConfig.subject) {
      setErrorMsg('Please specify the subject');
      return;
    }
    setLoadingSubmit(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/attendance/bulk', {
        ...bulkConfig,
        studentsPresent: presentStudents
      });
      setSuccessMsg(`Attendance marked successfully for ${batchStudents.length} students.`);
      setBatchStudents([]);
      setPresentStudents([]);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Manage Attendance</h1>
          <p className="text-slate-400 mt-2 font-medium">Update records or mark daily attendance.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('individual')}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'individual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Users size={18} className="mr-2" />
            Individual Update
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'bulk' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <UserCheck size={18} className="mr-2" />
            Bulk Daily Marking
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center font-medium">
          <CheckCircle2 className="mr-3" size={20} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      {activeTab === 'individual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Individual Logic ... (kept existing code) */}
          <div className="glass-panel rounded-3xl p-6 h-[600px] flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">Select Student</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search by Name or ID" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {loadingStudents ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <div 
                    key={s._id}
                    onClick={() => setSelectedStudent(s)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${
                      selectedStudent?._id === s._id ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <p className="text-white font-bold text-sm">{s.name}</p>
                    <p className="text-slate-400 text-xs">{s.userId} • {s.branch} {s.batch}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 text-sm py-10">No students found.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-white">
                  {selectedStudent ? `Records for ${selectedStudent.name}` : 'No Student Selected'}
                </h2>
                
                <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
                  {sessions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSession(s)}
                      disabled={!selectedStudent}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${
                        session === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {s.slice(0, 3)} '{s.slice(-2)}
                    </button>
                  ))}
                </div>
              </div>

              {!selectedStudent ? (
                <div className="py-20 text-center text-slate-500">
                  Please select a student from the list to view or update attendance.
                </div>
              ) : loadingAttendance ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                          <th className="px-4 py-3">Subject</th>
                          <th className="px-4 py-3 text-center">Total</th>
                          <th className="px-4 py-3 text-center">Attended</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {attendance.map(record => (
                          <tr key={record._id} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-sm text-white font-medium">{record.subject}</td>
                            <td className="px-4 py-3 text-center text-slate-400 text-sm">{record.totalClasses}</td>
                            <td className="px-4 py-3 text-center text-slate-300 text-sm font-bold">{record.attended}</td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => handleEditClick(record)}
                                className="text-xs font-bold text-blue-400 hover:text-blue-300"
                              >
                                Request Update
                              </button>
                            </td>
                          </tr>
                        ))}
                        {attendance.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-500 text-sm">No records found for this session.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={handleAddNewClick}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      + Request New Subject Record
                    </button>
                  </div>
                </>
              )}
            </div>

            {updateForm && (
              <div className="glass-panel rounded-3xl p-6 border border-blue-500/30 relative">
                <button onClick={() => setUpdateForm(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">✕</button>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Send size={16} className="text-blue-500" />
                  {updateForm.targetId ? 'Request Modification' : 'Request New Record'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject</label>
                    <input type="text" name="subject" required value={updateForm.subject} onChange={handleFormChange} readOnly={!!updateForm.targetId} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 read-only:opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Classes</label>
                    <input type="number" name="totalClasses" min="1" required value={updateForm.totalClasses} onChange={handleFormChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Attended</label>
                    <input type="number" name="attended" min="0" max={updateForm.totalClasses} required value={updateForm.attended} onChange={handleFormChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-3 mt-4 flex justify-end">
                    <button type="submit" disabled={loadingSubmit} className="flex items-center px-6 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50">
                      {loadingSubmit ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                      Submit to Admin
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Bulk Attendance Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Session</label>
                <select name="session" value={bulkConfig.session} onChange={handleBulkConfigChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  {sessions.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Batch</label>
                <select 
                  name="batch" 
                  value={bulkConfig.batch} 
                  onChange={handleBulkConfigChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="" className="bg-slate-900">Select Batch</option>
                  {batches.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Branch</label>
                <select 
                  name="branch" 
                  value={bulkConfig.branch} 
                  onChange={handleBulkConfigChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="" className="bg-slate-900">Select Branch</option>
                  {branches.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                </select>
              </div>
              <button 
                onClick={loadBatchStudents}
                disabled={loadingBatch}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                {loadingBatch ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Load Students'}
              </button>
            </div>
          </div>

          {batchStudents.length > 0 && (
            <div className="glass-panel rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Student Checklist</h3>
                  <p className="text-sm text-slate-500">{presentStudents.length} of {batchStudents.length} present</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 min-w-[200px]">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Subject Name</label>
                    <select 
                      name="subject" 
                      value={bulkConfig.subject} 
                      onChange={handleBulkConfigChange} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="" className="bg-slate-900">Select Subject</option>
                      {subjects.map(sub => <option key={sub} value={sub} className="bg-slate-900">{sub}</option>)}
                    </select>
                  </div>
                  <button 
                    onClick={handleBulkSubmit}
                    disabled={loadingSubmit}
                    className="flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {loadingSubmit ? <Loader2 size={18} className="animate-spin mr-2" /> : <CheckCircle2 size={18} className="mr-2" />}
                    Mark Attendance
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {batchStudents.map(student => (
                  <div 
                    key={student._id}
                    onClick={() => toggleStudentPresence(student._id)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                      presentStudents.includes(student._id) 
                        ? 'bg-blue-600/10 border-blue-500/50' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{student.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-black">{student.userId}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      presentStudents.includes(student._id) 
                        ? 'bg-blue-600 border-blue-400' 
                        : 'border-white/10'
                    }`}>
                      {presentStudents.includes(student._id) && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
