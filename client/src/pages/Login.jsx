import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, GraduationCap, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={universityLanding} 
          alt="University Campus" 
          className="w-full h-full object-cover scale-110 animate-subtle-zoom"
        />
        {/* Dark Overlays for depth */}
        <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/80 via-transparent to-[#020617]/80"></div>
      </div>

      {/* Floating Glass Login Card */}
      <div className="relative z-10 w-full max-w-[1100px] px-4 flex flex-col md:flex-row items-stretch justify-center gap-0 group">
        
        {/* Left Side: Brand Identity (Glassmorphism) */}
        <div className="hidden md:flex md:w-[45%] flex-col justify-between p-12 glass-panel rounded-l-[3rem] border-r-0 border-white/20">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] transform hover:rotate-6 transition-transform">
                <GraduationCap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">EduSync</h1>
                <div className="h-1 w-full bg-blue-500 rounded-full mt-1"></div>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                Your Future <br/>
                <span className="text-blue-400">Starts Here.</span>
              </h2>
              <p className="text-slate-200 font-medium text-lg leading-relaxed max-w-sm opacity-90">
                Access your academic records, attendance, and campus updates in one unified ecosystem.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-80"></div>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Joined by 5k+ Students</p>
          </div>
        </div>

        {/* Right Side: Login Form (Solid Glass) */}
        <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-center bg-[#020617]/90 backdrop-blur-3xl md:rounded-r-[3rem] rounded-[3rem] md:rounded-l-0 border border-white/20 shadow-2xl">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={14} />
                <span>Secure Authentication</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Welcome Back.</h1>
              <p className="text-slate-500 font-medium text-lg">Please sign in to your dashboard</p>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-400 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center animate-in fade-in slide-in-from-top-1 font-bold">
                <AlertCircle size={20} className="mr-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  placeholder="241099XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-bold text-lg"
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Portal Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-bold text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98] text-sm uppercase tracking-widest mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={24} className="mr-3 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={24} className="mr-3 group-hover:translate-x-1 transition-transform" />
                    Sign Into Portal
                  </>
                )}
              </button>
            </form>

            <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic Year</span>
                <span className="text-xs font-bold text-slate-300">2024 - 2028</span>
              </div>
              <div className="text-right flex flex-col items-center sm:items-end">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Affiliated Institution</span>
                <span className="text-xs font-bold text-slate-300">Chitkara University</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Extra floating background elements */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-zoom {
          0% { transform: scale(1.1); }
          100% { transform: scale(1.2); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s infinite alternate ease-in-out;
        }
      `}} />
    </div>
  );
};

export default Login;
