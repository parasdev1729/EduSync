import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-slate-950">
      <div className="flex items-center mb-6 text-3xl font-black text-blue-500 tracking-tight">
        EduSync
      </div>
      <div className="w-full bg-slate-900 rounded-2xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border border-slate-800">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-100 md:text-2xl text-center">
            Student Login
          </h1>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-400 rounded-xl bg-red-900/20 border border-red-800/50 flex items-center" role="alert">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="enrollmentNo" className="block mb-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                Enrollment Number
              </label>
              <input
                type="text"
                name="enrollmentNo"
                id="enrollmentNo"
                className="bg-slate-800 border border-slate-700 text-slate-100 sm:text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3 transition-all placeholder-slate-500"
                placeholder="241099XXXX"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-slate-800 border border-slate-700 text-slate-100 sm:text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3 transition-all placeholder-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-xl text-sm px-5 py-3 text-center transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 font-medium">
              Academic Portal for Batch 2024-28
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
