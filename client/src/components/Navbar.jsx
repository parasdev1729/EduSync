import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout, isSidebarOpen, setIsSidebarOpen } = useAuth();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [circulars, setCirculars] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/circulars');
        setCirculars(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatest();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id) => {
    setShowNotifications(false);
    navigate('/circulars', { state: { highlightId: id } });
  };

  const handleViewAllClick = () => {
    setShowNotifications(false);
    navigate('/circulars');
  };

  return (
    <nav className="glass-panel border-b border-white/10 fixed w-full z-50 top-0 transition-all rounded-b-[1.5rem]">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Unified Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-white glass-card rounded-lg transition-all"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
              <span className="text-white font-black text-xl italic tracking-tighter">E</span>
            </div>
            <span 
              className="text-xl font-black tracking-tight text-white hidden sm:block cursor-pointer"
              onClick={() => navigate('/')}
            >
              EduSync
            </span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white glass-card'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Notifications</h3>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {circulars.map((c) => (
                      <div 
                        key={c._id} 
                        onClick={() => handleNotificationClick(c._id)}
                        className="p-4 border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 tracking-tight">{c.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                        <p className="text-[9px] text-slate-600 mt-2 font-black uppercase tracking-widest">{new Date(c.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleViewAllClick}
                    className="w-full p-3 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest bg-white/5 transition-colors"
                  >
                    View All Circulars
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 pl-4 sm:pl-6 border-l border-white/10">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-slate-100 leading-none">{user?.name}</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Batch 2024</span>
              </div>
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-blue-400 font-bold border border-white/10 shadow-xl shrink-0 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                {user?.name?.charAt(0) || <User size={20} />}
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
