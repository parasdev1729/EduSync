import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  GraduationCap, 
  Bell, 
  Calendar, 
  UserCircle,
  Users,
  ClipboardList,
  FilePlus
} from 'lucide-react';

const Sidebar = () => {
  const { user, isSidebarOpen, setIsSidebarOpen } = useAuth();
  
  const getMenuItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { name: 'User Management', icon: <Users size={22} />, path: '/admin/users' },
        { name: 'Approval Requests', icon: <ClipboardList size={22} />, path: '/admin/requests' },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...commonItems,
        { name: 'Attendance', icon: <ClipboardCheck size={22} />, path: '/attendance' },
        { name: 'Request Circular', icon: <FilePlus size={22} />, path: '/teacher/request-circular' },
      ];
    }

    // Default: Student
    return [
      ...commonItems,
      { name: 'Attendance', icon: <ClipboardCheck size={22} />, path: '/attendance' },
      { name: 'Marks', icon: <GraduationCap size={22} />, path: '/marks' },
      { name: 'Circulars', icon: <Bell size={22} />, path: '/circulars' },
      { name: 'Activities', icon: <Calendar size={22} />, path: '/activities' },
      { name: 'My Info', icon: <UserCircle size={22} />, path: '/profile' },
    ];
  };

  const menuItems = getMenuItems();
  const progressPercent = user?.semester ? (user.semester / 8) * 100 : 0;

  return (
    <>
      {/* Overlay - Active on all screens when open to focus on sidebar and allow closing */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-40 flex flex-col w-64 h-full pt-16 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-[#020617] border-r border-white/5 shadow-2xl
      `}>
        <div className="flex flex-col flex-1 pt-8 pb-4 overflow-y-auto overflow-x-hidden px-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-xl transition-all duration-300 group overflow-hidden p-3 active-press
                  ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors shrink-0`}>
                      {item.icon}
                    </span>
                    <span className="ml-4 tracking-wide font-bold text-sm">
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-200 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#020617] border border-white/5 shadow-2xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">University</p>
            <p className="text-xs font-bold text-slate-300">Chitkara University</p>
            <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">
              Progress: {Math.round(progressPercent)}%
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
