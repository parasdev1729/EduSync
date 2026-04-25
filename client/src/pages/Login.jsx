import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import universityLanding from '../assets/university_landing.jpg';

const Login = () => {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [password, setPassword] = useState('');
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

    if (!enrollmentNo || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(enrollmentNo, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid enrollment number or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans selection:bg-blue-500/30 bg-[#020617]">
      
      {/* High-Quality University Background with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={universityLanding} 
          alt="University Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-[4px]"></div>
      </div>

      {/* Centered Compact Card */}
      <div className="relative z-10 w-full max-w-[440px] px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-6">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic">EduSync</h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.25em]">Student Portal Access</p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-xs text-red-400 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center animate-in fade-in slide-in-from-top-1 font-bold">
              <AlertCircle size={18} className="mr-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Enrollment Number
              </label>
              <input
                type="text"
                placeholder="241099XXXX"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold tracking-tight text-lg"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Portal Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold tracking-tight text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 group active:scale-[0.98] uppercase tracking-widest text-xs mt-4"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Minimal Footer */}
          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
              Chitkara University • Batch 2024-28
            </p>
          </div>
        </div>
      </div>
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Login;
