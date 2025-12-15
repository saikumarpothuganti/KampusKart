import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import NavLink from '../components/NavLink';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showLoader } = useLoading();
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name ||
      !formData.userId ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
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

  return (
    <div className="min-h-screen bg-[#0f1116] text-[#e5e7eb] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,#059669_0,transparent_25%),radial-gradient(circle_at_80%_0%,#047857_0,transparent_22%)]" />
      <div className="relative w-full max-w-md bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 text-xs text-[#9ca3af] mb-4">
          ✨ Create your account
        </div>
        <h1 className="text-3xl font-semibold mb-2">Join KampusKart</h1>
        <p className="text-[#9ca3af] mb-6">Create your account to get started</p>

        {error && (
          <div className="bg-red-50/10 border border-red-400/60 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">ID (for sign in)</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="e.g. admin123"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#059669] to-[#047857] text-white py-3 rounded-full font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-[#9ca3af] text-sm">
          Already have an account?{' '}
          <NavLink to="/signin" className="text-[#059669] font-semibold hover:underline">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
