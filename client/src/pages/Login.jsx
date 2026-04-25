import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import universityImage from '../assets/university.webp';

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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-blue-500/30 font-sans antialiased relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
        
        {/* Left Side: Brand & Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full overflow-hidden group">
          <img 
            src={universityImage} 
            alt="University Campus" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 transform -rotate-6">
                <GraduationCap className="text-white" size={28} />
              </div>
              <span className="text-3xl font-black tracking-tight text-white italic">EduSync</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Empowering Your <br/>
              <span className="text-blue-500">Academic Journey.</span>
            </h2>
            <p className="text-slate-300 font-medium max-w-sm">
              Your comprehensive portal for attendance, results, and campus updates.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">Student Login</h1>
              <p className="text-slate-400 font-medium">Please enter your credentials to continue</p>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-400 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="mr-3 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  placeholder="241099XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Batch 2024-28</span>
              <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest hover:text-blue-500 transition-colors cursor-default">Chitkara University</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
