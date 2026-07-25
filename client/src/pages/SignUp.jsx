import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import NavLink from '../components/NavLink';
import { GoogleLogin } from '@react-oauth/google';
import origamiDeliveryMan from '../assets/origami_delivery_man.png';
import API from '../lib/api';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const { showLoader } = useLoading();
  const [formData, setFormData] = useState({
    name: '', userId: '', email: '', password: '', confirmPassword: '', otp: '', gender: 'Other'
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.userId || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please use a @gmail.com address. University emails block our verification codes.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await API.post('/auth/send-otp', { email: formData.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    
    try {
      setLoading(true);
      showLoader(800);
      await signup(formData.name, formData.userId, formData.email, formData.password, formData.otp, formData.gender);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      showLoader(800);
      await googleLogin(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setError('Google sign in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign in was cancelled or failed.');
  };

  const inputClass = "w-full bg-[#FAF8F2] border-2 border-[#18382A]/10 text-[#18382A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#18382A]/40 transition font-medium placeholder:text-[#18382A]/30";
  const labelClass = "block text-xs font-bold text-[#18382A]/50 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-4 py-10 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#18382A]" style={{clipPath:'polygon(0 0,100% 0,100% 40%,98% 100%,95% 40%,92% 100%,89% 40%,86% 100%,83% 40%,80% 100%,77% 40%,74% 100%,71% 40%,68% 100%,65% 40%,62% 100%,59% 40%,56% 100%,53% 40%,50% 100%,47% 40%,44% 100%,41% 40%,38% 100%,35% 40%,32% 100%,29% 40%,26% 100%,23% 40%,20% 100%,17% 40%,14% 100%,11% 40%,8% 100%,5% 40%,2% 100%,0 40%)'}} />
      <img src={origamiDeliveryMan} className="absolute bottom-0 right-0 w-52 h-auto object-contain pointer-events-none opacity-90" style={{mixBlendMode:'multiply'}} alt="" />

      <div className="absolute top-24 left-12 w-4 h-4 rotate-45 bg-[#18382A]/10"></div>
      <div className="absolute top-48 right-16 w-3 h-3 rounded-full bg-[#18382A]/10"></div>
      <div className="absolute bottom-48 left-20 w-5 h-5 rounded-full bg-[#18382A]/10"></div>

      <div className="relative w-full max-w-md z-10">
        <div className="absolute -bottom-2 -right-2 w-full h-full rounded-[24px] bg-[#18382A]/10"></div>
        <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[24px] bg-[#18382A]/5"></div>

        <div className="relative bg-[#FDFBF7] rounded-[24px] overflow-hidden border border-[#18382A]/10"
             style={{boxShadow:'0 20px 60px rgba(24,56,42,0.10), 0 6px 20px rgba(24,56,42,0.06)'}}>

          <div className="bg-[#18382A] px-6 sm:px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-white/5"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[40px] border-r-transparent border-b-[40px] border-b-white/5"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">✨</div>
              <div>
                <h1 className="text-2xl font-serif font-black text-[#FAF8F2]">Join KampusKart</h1>
                <p className="text-[#FAF8F2]/60 text-sm">{step === 1 ? 'Create your account to get started' : 'Verify your email address'}</p>
              </div>
            </div>
          </div>

          <form onSubmit={step === 1 ? handleSendOtp : handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Student ID (for sign in)</label>
                  <input type="text" name="userId" value={formData.userId} onChange={handleChange} className={inputClass} placeholder="e.g. jdoe2024" required />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>
                    Email <span className="text-[10px] text-orange-500 ml-1">(Only @gmail.com supported)</span>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@gmail.com" required />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Gender (For Default Profile Pic)</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
                    <option value="Other">Other</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                </div>
                <div>
                  <label className={labelClass}>Confirm</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-[#18382A]/70 mb-4 text-sm font-medium">
                  We've sent a 6-digit code to <br/>
                  <span className="font-bold text-[#18382A]">{formData.email}</span>
                </div>
                <div>
                  <label className={labelClass}>6-Digit OTP</label>
                  <input 
                    type="text" 
                    name="otp" 
                    value={formData.otp} 
                    onChange={handleChange} 
                    className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`} 
                    placeholder="------" 
                    maxLength="6"
                    required 
                  />
                </div>
                <div className="text-center mt-2 flex flex-col gap-4">
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#18382A]/50 hover:text-[#18382A] font-bold uppercase tracking-widest transition">
                    ← Change Email
                  </button>
                  
                  <div className="bg-[#18382A]/5 p-3 rounded-xl border border-[#18382A]/10 text-xs text-[#18382A]/70 font-medium">
                    Not receiving the OTP? <br />
                    <button type="button" onClick={() => setStep(1)} className="text-[#18382A] font-bold hover:underline mt-1">
                      Go back
                    </button> and use <strong className="text-[#18382A]">Continue with Google</strong> instead.
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#18382A] text-[#FAF8F2] py-3.5 rounded-xl font-bold text-base shadow-lg hover:bg-[#064E3B] transition disabled:opacity-60 mt-2"
            >
              {loading ? 'Please wait...' : (step === 1 ? 'Send OTP →' : 'Verify & Create Account')}
            </button>

            {step === 1 && (
              <>
                <div className="flex items-center gap-3">
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
              </>
            )}

            <p className="text-center text-sm text-[#18382A]/50 font-medium pt-2">
              Already have an account?{' '}
              <NavLink to="/signin" className="text-[#18382A] font-black hover:underline">
                Sign In
              </NavLink>
            </p>
          </form>

          <svg className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none" viewBox="0 0 100 100">
            <polygon points="100,0 100,100 0,100" fill="#FAF8F2" />
            <polygon points="100,0 0,100 40,40" fill="#18382A" opacity="0.12" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
