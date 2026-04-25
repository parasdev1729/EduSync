import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Wide Card */}
      <div className="relative z-10 w-full max-w-6xl h-full min-h-[650px] flex flex-col md:flex-row bg-[#0f172a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
        
        {/* Left Section: Immersive Brand Hero */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden group">
          <img 
            src={universityLanding} 
            alt="University" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Refined Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
          
          <div className="absolute bottom-0 left-0 p-12 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10">
                <GraduationCap size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase italic">EduSync</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
                Empowering the <br/>
                <span className="text-blue-400">Next Generation.</span>
              </h2>
              <p className="text-slate-300 font-medium text-lg max-w-md opacity-80">
                The unified digital gateway for Chitkara University students. Manage your academic lifecycle with ease.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Focused Login Form */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 md:p-16 relative bg-[#0f172a]">
          {/* Form Content */}
          <div className="w-full max-w-sm space-y-12">
            <div className="space-y-4">
              <div className="lg:hidden flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter uppercase italic">EduSync</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Login.</h1>
              <p className="text-slate-400 font-medium">Enter your credentials to access your student portal.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Enrollment Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 241099XXXX"
                    className="w-full bg-[#1e293b]/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all font-bold tracking-tight text-lg"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">
                      Portal Password
                    </label>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#1e293b]/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all font-bold tracking-tight text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-3 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-white/5 text-center flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Developed By</span>
              <p className="text-xs font-bold text-slate-400">Team EduSync @ Chitkara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
