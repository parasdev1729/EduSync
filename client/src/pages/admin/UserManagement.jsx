import React, { useState, useEffect } from 'react';
import { Loader2, Users, Search, Filter, UserPlus, X, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');
  
  // Create user state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    role: 'student',
    phone: '',
    branch: '',
    semester: 1,
    section: '',
    batch: '',
    department: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (filterRole ? u.role === filterRole : true) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.userId.toLowerCase().includes(search.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessData(null);
    try {
      const response = await api.post('/users', formData);
      setSuccessData(response.data);
      fetchUsers(); // Refresh list
      // Reset form
      setFormData({
        userId: '', name: '', email: '', role: 'student', phone: '',
        branch: '', semester: 1, section: '', batch: '', department: ''
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-2 font-medium">View and manage all system users.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <UserPlus size={18} className="mr-2" />
            Add New User
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or Name" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64"
            />
          </div>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <Filter className="absolute left-3 text-slate-500" size={14} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-transparent text-sm text-slate-300 pl-8 pr-4 py-1.5 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Roles</option>
              <option value="student" className="bg-slate-900">Students</option>
              <option value="teacher" className="bg-slate-900">Teachers</option>
              <option value="admin" className="bg-slate-900">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white flex items-center">
                <UserPlus size={24} className="mr-3 text-blue-500" />
                Onboard New User
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {successData ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white">User Created!</h3>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left space-y-2">
                    <p className="text-slate-400 text-sm">Provide these credentials to the user:</p>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500 text-xs uppercase font-black">User ID</span>
                      <span className="text-white font-bold">{successData.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-xs uppercase font-black">Temporary Password</span>
                      <span className="text-blue-400 font-mono font-black">{successData.temporaryPassword}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSuccessData(null); setShowModal(false); }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-all mt-6"
                  >
                    Done
                  </button>
                  <button 
                    onClick={() => setSuccessData(null)}
                    className="text-slate-500 hover:text-slate-300 font-bold text-sm block mx-auto pt-2"
                  >
                    Add Another User
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateUser} className="space-y-6">
                  {errorMsg && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">User ID / Roll No</label>
                      <input type="text" name="userId" required value={formData.userId} onChange={handleInputChange} placeholder="221099XXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Role</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                        <option value="student" className="bg-slate-900">Student</option>
                        <option value="teacher" className="bg-slate-900">Teacher</option>
                        <option value="admin" className="bg-slate-900">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full my-6"></div>

                  {formData.role === 'student' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Branch</label>
                        <input type="text" name="branch" required={formData.role === 'student'} value={formData.branch} onChange={handleInputChange} placeholder="e.g. CSE" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Batch</label>
                        <input type="text" name="batch" required={formData.role === 'student'} value={formData.batch} onChange={handleInputChange} placeholder="e.g. 2022" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Semester</label>
                        <input type="number" name="semester" min="1" max="8" required={formData.role === 'student'} value={formData.semester} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Section</label>
                        <input type="text" name="section" required={formData.role === 'student'} value={formData.section} onChange={handleInputChange} placeholder="e.g. A" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                    </div>
                  )}

                  {formData.role === 'teacher' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                        <input type="text" name="department" required={formData.role === 'teacher'} value={formData.department} onChange={handleInputChange} placeholder="e.g. Applied Sciences" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
                    Finalize Registration
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Users size={20} className="mr-3 text-blue-500" />
            System Directory
          </h2>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full">
            {filteredUsers.length} Users
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#070b19] z-10 shadow-md">
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department / Branch</th>
                  <th className="px-6 py-4">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                  <tr key={u._id} className="group hover:bg-white/5 transition-all">
                    <td className="px-6 py-4 text-sm font-bold text-slate-300">{u.userId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        u.role === 'teacher' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                      {u.role === 'student' ? `${u.branch} (${u.batch})` : u.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {u.phone || '-'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
