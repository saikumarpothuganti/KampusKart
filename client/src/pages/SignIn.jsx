import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import NavLink from '../components/NavLink';
import GlowAlert from '../components/GlowAlert';
import { GoogleLogin } from '@react-oauth/google';
import origamiStudent from '../assets/origami_student.png';
import origamiDeliveryMan from '../assets/origami_delivery_man.png';

const SignIn = () => {
  const navigate = useNavigate();
  const { signin, googleLogin } = useAuth();
  const { showLoader } = useLoading();
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ message: '', variant: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertState({ message: '', variant: 'success' });
    if (!formData.userId || !formData.password) {
      setAlertState({ message: 'Please fill all fields', variant: 'error' });
      return;
    }
    try {
      setLoading(true);
      showLoader(1200);
      const data = await signin(formData.userId, formData.password);
      await new Promise(resolve => setTimeout(resolve, 300));
      if (data?.user?.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 400) {
        setAlertState({ message: 'Invalid credentials', variant: 'error' });
      } else {
        setAlertState({ message: 'Connection error. Please check your network and try again.', variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      showLoader(1200);
      const data = await googleLogin(credentialResponse.credential);
      await new Promise(resolve => setTimeout(resolve, 300));
      if (data?.user?.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      setAlertState({ message: 'Google sign in failed. Please try again.', variant: 'error' });
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setAlertState({ message: 'Google sign in was cancelled or failed.', variant: 'error' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Background torn paper edge top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#18382A]" style={{clipPath:'polygon(0 0,100% 0,100% 40%,98% 100%,95% 40%,92% 100%,89% 40%,86% 100%,83% 40%,80% 100%,77% 40%,74% 100%,71% 40%,68% 100%,65% 40%,62% 100%,59% 40%,56% 100%,53% 40%,50% 100%,47% 40%,44% 100%,41% 40%,38% 100%,35% 40%,32% 100%,29% 40%,26% 100%,23% 40%,20% 100%,17% 40%,14% 100%,11% 40%,8% 100%,5% 40%,2% 100%,0 40%)'}} />

      {/* Ambient origami characters */}
      <img src={origamiStudent} className="absolute bottom-0 left-0 w-56 h-auto object-contain pointer-events-none opacity-90" style={{mixBlendMode:'multiply'}} alt="" />
      <img src={origamiDeliveryMan} className="absolute bottom-0 right-0 w-48 h-auto object-contain pointer-events-none opacity-90" style={{mixBlendMode:'multiply'}} alt="" />

      {/* Scattered origami dots */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-[#18382A]/10"></div>
      <div className="absolute top-40 right-20 w-5 h-5 rounded-full bg-[#18382A]/10"></div>
      <div className="absolute bottom-40 left-32 w-4 h-4 rotate-45 bg-[#18382A]/10"></div>

      {/* Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Stacked paper effect */}
        <div className="absolute -bottom-2 -right-2 w-full h-full rounded-[24px] bg-[#18382A]/10 border border-[#18382A]/10"></div>
        <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[24px] bg-[#18382A]/5 border border-[#18382A]/10"></div>

        <div className="relative bg-[#FDFBF7] rounded-[24px] overflow-hidden border border-[#18382A]/10"
             style={{boxShadow:'0 20px 60px rgba(24,56,42,0.10), 0 6px 20px rgba(24,56,42,0.06)'}}>

          {/* Green header strip */}
          <div className="bg-[#18382A] px-6 sm:px-8 py-6 relative overflow-hidden">
            {/* Decorative origami triangles in header */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-white/5"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[40px] border-r-transparent border-b-[40px] border-b-white/5"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🔒</div>
              <div>
                <h1 className="text-2xl font-serif font-black text-[#FAF8F2]">Welcome Back</h1>
                <p className="text-[#FAF8F2]/60 text-sm">Sign in to your KampusKart account</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#18382A]/50 uppercase tracking-widest mb-2">Student ID or Email</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full bg-[#FAF8F2] border-2 border-[#18382A]/10 text-[#18382A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#18382A]/40 transition font-medium placeholder:text-[#18382A]/30"
                placeholder="your-id or email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18382A]/50 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#FAF8F2] border-2 border-[#18382A]/10 text-[#18382A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#18382A]/40 transition font-medium placeholder:text-[#18382A]/30"
                placeholder="••••••••"
                required
              />
              <div className="text-right mt-2">
                <NavLink to="/forgot-password" className="text-xs text-[#18382A]/60 font-bold hover:text-[#18382A] hover:underline">
                  Forgot Password?
                </NavLink>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#18382A] text-[#FAF8F2] py-3.5 rounded-xl font-bold text-base shadow-lg hover:bg-[#064E3B] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Signing you in…</span>
                </>
              ) : 'Sign In →'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 border-t border-dashed border-[#18382A]/15"></div>
              <span className="text-xs text-[#18382A]/30 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-dashed border-[#18382A]/15"></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="rectangular"
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

            <p className="text-center text-sm text-[#18382A]/50 font-medium">
              Don't have an account?{' '}
              <NavLink to="/signup" className="text-[#18382A] font-black hover:underline">
                Sign Up
              </NavLink>
            </p>
          </form>

          {/* Bottom folded corner */}
          <svg className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none" viewBox="0 0 100 100">
            <polygon points="100,0 100,100 0,100" fill="#FAF8F2" />
            <polygon points="100,0 0,100 40,40" fill="#18382A" opacity="0.12" />
          </svg>
        </div>
      </div>

      <GlowAlert
        message={alertState.message}
        variant={alertState.variant}
        onClose={() => setAlertState({ message: '', variant: 'success' })}
        okText="OK"
      />
    </div>
  );
};

export default SignIn;
