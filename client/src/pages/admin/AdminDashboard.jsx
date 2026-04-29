import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, ClipboardList, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useSocket from '../../hooks/useSocket';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (socket) {
      socket.on('new_request', fetchStats);
      return () => {
        socket.off('new_request', fetchStats);
      };
    }
  }, [socket, fetchStats]);

  const adminStats = [
    { 
      label: 'Total Users', 
      val: stats?.totalUsers || '0', 
      icon: Users, 
      col: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      path: '/admin/users' 
    },
    { 
      label: 'Pending Requests', 
      val: stats?.pendingRequests || '0', 
      icon: ClipboardList, 
      col: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      path: '/admin/requests' 
    },
    { 
      label: 'System Health', 
      val: stats?.systemHealth || 'Optimal', 
      icon: ShieldCheck, 
      col: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      path: '/' 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 font-bold animate-pulse">Initializing Control Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Welcome, <span className="text-blue-400">Administrator {user?.name.split(' ')[0]}</span>. System-wide management active.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminStats.map((item, i) => (
          <div 
            key={i} 
            onClick={() => navigate(item.path)}
            className="relative group overflow-hidden glass-card p-6 rounded-[2rem] hover:bg-white/[0.05] cursor-pointer active-press"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-3xl -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10">
              <div className={`p-3 w-fit rounded-2xl ${item.bg} ${item.col} mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
              <h3 className="text-2xl font-black text-white mt-1 truncate tracking-tight">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem]">
        <h2 className="text-xl font-black text-white mb-4 tracking-tight">System Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-slate-500 text-xs font-black uppercase mb-1">Students</p>
                <p className="text-2xl font-black text-white">{stats?.totalStudents || 0}</p>
            </div>
            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-slate-500 text-xs font-black uppercase mb-1">Teachers</p>
                <p className="text-2xl font-black text-white">{stats?.totalTeachers || 0}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
