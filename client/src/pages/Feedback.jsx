import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import { useLoading } from '../context/LoadingContext';

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
      const response = await API.post('/feedback', formData);
      console.log('Feedback submitted successfully:', response.data);
      setSuccessMsg('Thank you for your feedback! 🎉');
      setFormData({
        name: user?.name || '',
        department: '',
        feedback: '',
        rating: 5,
        email: user?.email || '',
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      setErrorMsg(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1116] text-[#e5e7eb] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
        >
          <span className="text-yellow-400 font-bold text-lg">🏠</span>
          <span className="font-semibold">Go to Home</span>
        </button>
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#059669]/10 to-[#047857]/10 border-b border-[rgba(255,255,255,0.08)] px-8 py-6 relative">
            <h1 className="text-3xl font-bold text-[#e5e7eb]">📝 Share Your Feedback</h1>
            <p className="text-[#9ca3af] mt-2">
              Help us improve KampusKart with your valuable feedback
            </p>
            <Link
              to="/order-history"
              className="absolute top-6 right-8 text-sm font-semibold text-[#10b981] hover:text-[#34d399] underline-offset-4 hover:underline"
            >
              Continue with Status →
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
                {successMsg}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#1a2233] border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-3 text-[#e5e7eb] focus:outline-none focus:border-[#059669] transition"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1a2233] border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-3 text-[#e5e7eb] focus:outline-none focus:border-[#059669] transition"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-[#1a2233] border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-3 text-[#e5e7eb] focus:outline-none focus:border-[#059669] transition"
                required
              >
                <option value="">Select your department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics & Communication Engineering</option>
                <option value="EEE">Electrical & Electronics Engineering</option>
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
              <label className="block text-sm font-medium mb-3">
                Rate Your Experience *
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-4xl transition-all transform hover:scale-110 ${
                      star <= formData.rating
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="ml-3 text-[#9ca3af] text-sm">
                  {formData.rating} / 5
                </span>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Feedback *
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={6}
                className="w-full bg-[#1a2233] border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-3 text-[#e5e7eb] focus:outline-none focus:border-[#059669] transition resize-none"
                placeholder="Tell us about your experience with KampusKart..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#059669] to-[#047857] text-white py-4 rounded-full font-semibold text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition"
            >
              Submit Feedback
            </button>

            <p className="text-center text-sm text-[#9ca3af] mt-4">
              Your feedback helps us serve you better! 💚
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
