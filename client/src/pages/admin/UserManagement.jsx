import React, { useState, useEffect } from 'react';
import { Loader2, Users, Search, Filter } from 'lucide-react';
import api from '../../api/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (filterRole ? u.role === filterRole : true) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.userId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-2 font-medium">View and manage all system users.</p>
        </div>
        
        <div className="flex items-center gap-4">
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
