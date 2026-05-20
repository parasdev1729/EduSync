import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, GraduationCap, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const STEP = { EMAIL: 'email', OTP: 'otp', SUCCESS: 'success' };
const OTP_DIGITS = 6;
const OTP_TTL_SECONDS = 10 * 60;

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState(STEP.EMAIL);

  // Form state
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(Array(OTP_DIGITS).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const timerRef = useRef(null);

  // OTP input refs for auto-focus
  const otpRefs = useRef([]);

  const startTimer = () => {
    setSecondsLeft(OTP_TTL_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ──────── Step 1: Request OTP ────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address'); return; }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setStep(STEP.OTP);
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ──────── OTP input handling ────────
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpValues];
    next[index] = digit;
    setOtpValues(next);
    if (digit && index < OTP_DIGITS - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_DIGITS);
    if (pasted.length === OTP_DIGITS) {
      setOtpValues(pasted.split(''));
      otpRefs.current[OTP_DIGITS - 1]?.focus();
    }
    e.preventDefault();
  };

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;
    setError('');
    setOtpValues(Array(OTP_DIGITS).fill(''));
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // ──────── Step 2: Verify OTP + Reset Password ────────
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-red-500' });

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-blue-500' };
    return { score, label: 'Very Strong', color: 'bg-green-500' };
  };

  const handlePasswordChange = (val) => {
    setNewPassword(val);
    setStrength(calculateStrength(val));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const otp = otpValues.join('');
    if (otp.length < OTP_DIGITS) { setError('Please enter the complete 6-digit OTP'); return; }
    if (!newPassword) { setError('Please enter a new password'); return; }
    if (
      newPassword.length < 8 ||
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) { 
      setError('Password must be at least 8 chars with uppercase, lowercase, number, and special character'); 
      return; 
    }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (secondsLeft === 0) { setError('OTP has expired. Please request a new one.'); return; }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email: email.trim(), otp, newPassword });
      setSuccessMsg(res.data.message);
      clearInterval(timerRef.current);
      setStep(STEP.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] font-sans selection:bg-blue-500/30 p-4">

      {/* Background glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/30">
            <GraduationCap className="text-white" size={22} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">EduSync</span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* ── STEP 1: Email ── */}
          {step === STEP.EMAIL && (
            <div className="space-y-7">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-4">
                  <KeyRound className="text-blue-400" size={22} />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Forgot Password?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">Enter your registered email address. We'll send a 6-digit OTP to reset your password.</p>
              </div>

              {error && (
                <div className="p-3.5 text-xs text-red-400 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 font-bold uppercase tracking-wider">
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Registered Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium text-sm"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Mail size={16} className="mr-2" /> Send OTP</>}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: OTP + New Password ── */}
          {step === STEP.OTP && (
            <div className="space-y-7">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Lock className="text-blue-400" size={22} />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Reset Password</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  OTP sent to <span className="text-blue-400 font-bold">{email}</span>.
                </p>
              </div>

              {/* Countdown */}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${secondsLeft > 0 ? 'bg-blue-600/8 border-blue-500/10' : 'bg-red-500/8 border-red-500/10'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">OTP Code</span>
                <span className={`font-black text-xs font-mono ${secondsLeft > 60 ? 'text-blue-400' : secondsLeft > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {secondsLeft > 0 ? `Expires in ${formatTime(secondsLeft)}` : 'Expired'}
                </span>
              </div>

              {error && (
                <div className="p-3.5 text-xs text-red-400 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 font-bold uppercase tracking-wider">
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* OTP boxes */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 text-center block">Enter 6-Digit OTP</label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otpValues.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-digit-${i}`}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-xl font-black text-white bg-white/[0.04] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all caret-transparent"
                      />
                    ))}
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-1 px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">New Password</label>
                    {newPassword && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${strength.color.replace('bg-', 'text-')}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="new-password"
                      type="password"
                      placeholder="Min. 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-5 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium text-sm"
                      value={newPassword}
                      onChange={e => handlePasswordChange(e.target.value)}
                      required
                    />
                  </div>
                  {/* Strength Bar */}
                  {newPassword && (
                    <div className="flex gap-1 h-1 px-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`flex-1 rounded-full transition-all duration-500 ${s <= strength.score ? strength.color : 'bg-white/5'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter new password"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-5 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium text-sm"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  id="reset-password-btn"
                  type="submit"
                  disabled={isLoading || secondsLeft === 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={16} className="mr-2" />Update Password</>}
                </button>
              </form>


              {/* Resend */}
              <div className="text-center pt-1">
                <button
                  id="resend-otp-btn"
                  type="button"
                  onClick={handleResendOtp}
                  disabled={secondsLeft > 0 || isLoading}
                  className="text-xs font-bold text-slate-500 hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw size={13} />
                  {secondsLeft > 0 ? `Resend OTP in ${formatTime(secondsLeft)}` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === STEP.SUCCESS && (
            <div className="space-y-7 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">All Done!</h1>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{successMsg}</p>
                </div>
              </div>

              <button
                id="go-to-login-btn"
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {/* Back to login link (not on success) */}
        {step !== STEP.SUCCESS && (
          <button
            id="back-to-login-link"
            onClick={() => navigate('/login')}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-300 transition-colors mx-auto"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        )}

        <p className="text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mt-8">
          Chitkara University · EduSync
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
