import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import universityLanding from '../assets/university_landing.jpg';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!userId || !password || !role) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(userId, password, role);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid credentials or role');
    }
    setIsLoading(false);
  };

  const roles = [
    { id: 'student', label: 'Student' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'admin', label: 'Admin' }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#020617] font-sans selection:bg-blue-500/30">
      
      {/* LEFT SIDE: Immersive Image (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[60%] relative overflow-hidden">
        <img 
          src={universityLanding} 
          alt="University Campus" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/40 to-[#020617]"></div>
        
        {/* Branding on Image */}
        <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="text-white" size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase italic">EduSync</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              Excellence in <br/>
              <span className="text-blue-500">Digital Education.</span>
            </h2>
            <p className="text-slate-300 font-medium text-lg opacity-80">
              Welcome to the official EduSync portal. Select your role and sign in to access your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Login Form */}
      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-[#020617]">
        <div className="w-full max-w-[400px] space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">EduSync</h1>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white tracking-tight">Sign In</h1>
            <p className="text-slate-500 font-medium text-sm tracking-wide">Enter your credentials below</p>
          </div>

          {error && (
            <div className="p-4 text-xs text-red-400 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center animate-in fade-in zoom-in-95 font-bold uppercase tracking-wider">
              <AlertCircle size={16} className="mr-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Access Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      role === r.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                User ID / ID Number
              </label>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold tracking-tight text-base"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold tracking-tight text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4.5 rounded-xl transition-all shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 group active:scale-[0.98] uppercase tracking-widest text-xs mt-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Access Portal</span>
                  <LogIn size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Branding */}
          <div className="pt-10 border-t border-white/5 flex flex-col space-y-1">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Institutional Access</span>
            <p className="text-xs font-bold text-slate-400">Chitkara University, Punjab</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
