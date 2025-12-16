import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import NavLink from '../components/NavLink';
import { API_BASE_URL } from '../config.js';
import GlowAlert from '../components/GlowAlert';

const SignIn = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
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
      // Wait briefly for user context to be ready before navigating
      await new Promise(resolve => setTimeout(resolve, 300));
      if (data?.user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 400) {
        setAlertState({ message: 'Invalid credentials', variant: 'error' });
      } else {
        setAlertState({ message: 'Internet connection error. Please check your connection and try again.', variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1116] text-[#e5e7eb] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,#059669_0,transparent_25%),radial-gradient(circle_at_80%_0%,#047857_0,transparent_22%)]" />
      <div className="relative w-full max-w-md bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 text-xs text-[#9ca3af] mb-4">
          🔒 Secure Sign In
        </div>
        <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
        <p className="text-[#9ca3af] mb-6">Sign in to your KampusKart account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-[#9ca3af]">ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
              placeholder="your-id"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#059669] to-[#047857] text-white py-3 rounded-full font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Signing you in…</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[#9ca3af] text-sm">
          Don't have an account?{' '}
          <NavLink to="/signup" className="text-[#059669] font-semibold hover:underline">
            Sign Up
          </NavLink>
        </p>
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
