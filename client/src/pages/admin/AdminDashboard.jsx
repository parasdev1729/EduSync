import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, ClipboardList, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminStats = [
    { label: 'Total Users', val: '1,240', icon: Users, col: 'text-blue-400', bg: 'bg-blue-500/10', path: '/admin/users' },
    { label: 'Pending Requests', val: '12', icon: ClipboardList, col: 'text-amber-400', bg: 'bg-amber-500/10', path: '/admin/requests' },
    { label: 'System Health', val: 'Optimal', icon: ShieldCheck, col: 'text-emerald-400', bg: 'bg-emerald-500/10', path: '/' },
  ];

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
        <p className="text-slate-400 font-medium">
          This is the administrative dashboard where you can manage users, approve requests, and monitor system activities. 
          Use the sidebar or the quick links above to navigate.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
