import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import NavLink from '../components/NavLink';
import origamiDeliveryMan from '../assets/origami_delivery_man.png';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showLoader } = useLoading();
  const [formData, setFormData] = useState({
    name: '', userId: '', email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      showLoader(800);
      await signup(formData.name, formData.userId, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#FAF8F2] border-2 border-[#18382A]/10 text-[#18382A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#18382A]/40 transition font-medium placeholder:text-[#18382A]/30";
  const labelClass = "block text-xs font-bold text-[#18382A]/50 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-4 py-10 relative overflow-hidden font-sans">

      {/* Background torn paper edge top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#18382A]" style={{clipPath:'polygon(0 0,100% 0,100% 40%,98% 100%,95% 40%,92% 100%,89% 40%,86% 100%,83% 40%,80% 100%,77% 40%,74% 100%,71% 40%,68% 100%,65% 40%,62% 100%,59% 40%,56% 100%,53% 40%,50% 100%,47% 40%,44% 100%,41% 40%,38% 100%,35% 40%,32% 100%,29% 40%,26% 100%,23% 40%,20% 100%,17% 40%,14% 100%,11% 40%,8% 100%,5% 40%,2% 100%,0 40%)'}} />

      {/* Ambient origami character */}
      <img src={origamiDeliveryMan} className="absolute bottom-0 right-0 w-52 h-auto object-contain pointer-events-none opacity-90" style={{mixBlendMode:'multiply'}} alt="" />

      {/* Scattered dots */}
      <div className="absolute top-24 left-12 w-4 h-4 rotate-45 bg-[#18382A]/10"></div>
      <div className="absolute top-48 right-16 w-3 h-3 rounded-full bg-[#18382A]/10"></div>
      <div className="absolute bottom-48 left-20 w-5 h-5 rounded-full bg-[#18382A]/10"></div>

      {/* Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Stacked paper effect */}
        <div className="absolute -bottom-2 -right-2 w-full h-full rounded-[24px] bg-[#18382A]/10"></div>
        <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[24px] bg-[#18382A]/5"></div>

        <div className="relative bg-[#FDFBF7] rounded-[24px] overflow-hidden border border-[#18382A]/10"
             style={{boxShadow:'0 20px 60px rgba(24,56,42,0.10), 0 6px 20px rgba(24,56,42,0.06)'}}>

          {/* Green header strip */}
          <div className="bg-[#18382A] px-6 sm:px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-white/5"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[40px] border-r-transparent border-b-[40px] border-b-white/5"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">✨</div>
              <div>
                <h1 className="text-2xl font-serif font-black text-[#FAF8F2]">Join KampusKart</h1>
                <p className="text-[#FAF8F2]/60 text-sm">Create your account to get started</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

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
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" required />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#18382A] text-[#FAF8F2] py-3.5 rounded-xl font-bold text-base shadow-lg hover:bg-[#064E3B] transition disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-dashed border-[#18382A]/15"></div>
              <span className="text-xs text-[#18382A]/30 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-dashed border-[#18382A]/15"></div>
            </div>

            <p className="text-center text-sm text-[#18382A]/50 font-medium">
              Already have an account?{' '}
              <NavLink to="/signin" className="text-[#18382A] font-black hover:underline">
                Sign In
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
    </div>
  );
};

export default SignUp;
