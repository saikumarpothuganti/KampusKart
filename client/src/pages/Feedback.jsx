import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import { useLoading } from '../context/LoadingContext';
import origamiStudent from '../assets/origami_student.png';
import origamiDeliveryMan from '../assets/origami_delivery_man.png';

const StarRating = ({ rating, setRating }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="transition-all duration-150 hover:scale-125 focus:outline-none"
      >
        <svg viewBox="0 0 24 24" className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-amber-400 stroke-amber-500' : 'fill-[#18382A]/10 stroke-[#18382A]/20'}`} strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
        </svg>
      </button>
    ))}
    <span className="ml-2 text-sm font-bold text-[#18382A]/50">{rating}/5</span>
  </div>
);

const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showLoader } = useLoading();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: '',
    feedback: '',
    rating: 5,
    email: user?.email || '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!formData.name || !formData.department || !formData.feedback) {
      setErrorMsg('Please fill all required fields');
      return;
    }
    try {
      showLoader(800);
      await API.post('/feedback', formData);
      setSuccessMsg('Thank you for your feedback! We really appreciate it.');
      setFormData({ name: user?.name || '', department: '', feedback: '', rating: 5, email: user?.email || '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    }
  };

  const inputClass = "w-full bg-[#FAF8F2] border-2 border-[#18382A]/10 text-[#18382A] rounded-xl px-4 py-3 focus:outline-none focus:border-[#18382A]/40 transition font-medium placeholder:text-[#18382A]/30";
  const labelClass = "block text-xs font-bold text-[#18382A]/50 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#FAF8F2] relative pb-20 font-sans overflow-x-hidden">

      {/* Top torn paper strip */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#18382A]" style={{clipPath:'polygon(0 0,100% 0,100% 40%,98% 100%,95% 40%,92% 100%,89% 40%,86% 100%,83% 40%,80% 100%,77% 40%,74% 100%,71% 40%,68% 100%,65% 40%,62% 100%,59% 40%,56% 100%,53% 40%,50% 100%,47% 40%,44% 100%,41% 40%,38% 100%,35% 40%,32% 100%,29% 40%,26% 100%,23% 40%,20% 100%,17% 40%,14% 100%,11% 40%,8% 100%,5% 40%,2% 100%,0 40%)'}} />

      {/* Ambient origami characters */}
      <img src={origamiDeliveryMan} className="absolute top-40 -right-6 w-60 h-auto object-contain pointer-events-none opacity-90 z-0" style={{mixBlendMode:'multiply'}} alt="" />
      <img src={origamiStudent} className="absolute bottom-20 -left-6 w-64 h-auto object-contain pointer-events-none opacity-90 z-0" style={{mixBlendMode:'multiply'}} alt="" />

      {/* Decorative dots */}
      <div className="absolute top-32 left-16 w-4 h-4 rotate-45 bg-[#18382A]/10"></div>
      <div className="absolute top-60 right-24 w-3 h-3 rounded-full bg-[#18382A]/10"></div>
      <div className="absolute bottom-60 left-32 w-5 h-5 rounded-full bg-[#18382A]/8"></div>

      <div className="max-w-2xl mx-auto px-4 pt-16 relative z-10">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 px-5 py-2 bg-[#FAF8F2] border-2 border-[#18382A] text-[#18382A] font-bold rounded-full shadow-[4px_4px_0px_#18382A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#18382A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm"
        >
          ← Back to Home
        </button>

        {/* Page Title */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-5xl drop-shadow-sm">📝</span>
          <div>
            <h1 className="text-4xl font-serif font-black text-[#18382A]">Share Your Feedback</h1>
            <p className="text-[#18382A]/60 font-medium mt-1">Help us improve KampusKart with your valuable feedback</p>
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          {/* Stacked paper effect */}
          <div className="absolute -bottom-2 -right-2 w-full h-full rounded-[24px] bg-[#18382A]/10"></div>
          <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[24px] bg-[#18382A]/5"></div>

          <div className="relative bg-[#FDFBF7] rounded-[24px] overflow-hidden border border-[#18382A]/8"
               style={{boxShadow:'0 20px 60px rgba(24,56,42,0.08), 0 6px 20px rgba(24,56,42,0.05)'}}>

            {/* Order History link in header */}
            <div className="bg-[#18382A] px-8 py-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-white/5"></div>
              <span className="text-[#FAF8F2]/70 text-sm font-medium">Fill out the form below</span>
              <Link to="/order-history" className="text-sm font-bold text-[#FAF8F2] hover:text-amber-300 transition flex items-center gap-1">
                View Orders →
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">🎉</span> {successMsg}
                </div>
              )}

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your full name" required />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className={labelClass}>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange} className={inputClass} required>
                  <option value="">Select your department</option>
                  <option value="CSE">Computer Science Engineering</option>
                  <option value="ECE">Electronics &amp; Communication</option>
                  <option value="EEE">Electrical &amp; Electronics</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className={labelClass}>Rate Your Experience *</label>
                <StarRating rating={formData.rating} setRating={(r) => setFormData({ ...formData, rating: r })} />
              </div>

              {/* Feedback textarea */}
              <div>
                <label className={labelClass}>Your Feedback *</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your experience with KampusKart..."
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#18382A] text-[#FAF8F2] py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#064E3B] transition flex items-center justify-center gap-2"
              >
                <span>Submit Feedback</span>
                <span>→</span>
              </button>

              <p className="text-center text-sm text-[#18382A]/40 font-medium">
                Your feedback helps us serve you better 💚
              </p>
            </form>

            {/* Bottom folded corner */}
            <svg className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none" viewBox="0 0 100 100">
              <polygon points="100,0 100,100 0,100" fill="#FAF8F2" />
              <polygon points="100,0 0,100 40,40" fill="#18382A" opacity="0.12" />
              <polygon points="100,0 40,40 100,30" fill="#18382A" opacity="0.06" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
