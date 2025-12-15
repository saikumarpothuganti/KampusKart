import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    userId: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    let mounted = true;
    
    const fetchProfile = async () => {
      try {
        const response = await API.get('/auth/profile');
        if (mounted) {
          setProfile(response.data);
          setPasswordForm(prev => ({ ...prev, userId: response.data.userId }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          setAlertMessage('Failed to load profile');
          setAlertType('error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlertMessage('New passwords do not match');
      setAlertType('error');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setAlertMessage('Password must be at least 6 characters');
      setAlertType('error');
      return;
    }

    try {
      await API.post('/auth/change-password', {
        userId: passwordForm.userId,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      setAlertMessage('Password changed successfully');
      setAlertType('success');
      setPasswordForm({
        userId: profile.userId,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
    } catch (error) {
      setAlertMessage(error.response?.data?.error || error.response?.data?.message || 'Failed to change password');
      setAlertType('error');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1116] text-[#e5e7eb] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#e5e7eb]">My Profile</h1>
        
        {alertMessage && (
          <div className={`mb-4 p-4 rounded ${alertType === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
            {alertMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Profile Card */}
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#e5e7eb]">{profile.name}</h2>
                <p className="text-[#9ca3af]">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#9ca3af]">User ID</p>
                <p className="font-semibold text-[#e5e7eb]">{profile.userId}</p>
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Role</p>
                <p className="font-semibold capitalize text-[#e5e7eb]">{profile.role}</p>
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Member Since</p>
                <p className="font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="block w-full text-center bg-gradient-to-r from-[#10b981] to-[#047857] text-white py-2 rounded-xl font-semibold hover:from-[#059669] hover:to-[#065f46] transition-all duration-200"
              >
                {showChangePassword ? 'Hide Change Password' : 'Change Password'}
              </button>
              
              <button
                onClick={() => navigate('/order-history')}
                className="block w-full text-center bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#10b981] py-2 rounded-xl font-semibold hover:bg-[#10b981] hover:text-white transition-all duration-200"
              >
                View My Orders
              </button>
              
              {profile.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="block w-full text-center bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#a78bfa] py-2 rounded-xl font-semibold hover:bg-[#a78bfa] hover:text-white transition-all duration-200"
                >
                  Admin Panel
                </button>
              )}
              
              <button
                onClick={() => {
                  logout();
                  navigate('/signin');
                }}
                className="block w-full text-center bg-[#0f1116] border border-red-500/50 text-red-400 py-2 rounded-xl font-semibold hover:bg-red-500/20 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Change Password Card */}
          {showChangePassword && (
            <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#e5e7eb]">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9ca3af]">User ID</label>
                  <input
                    type="text"
                    value={passwordForm.userId}
                    onChange={(e) => setPasswordForm({ ...passwordForm, userId: e.target.value })}
                    className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 focus:outline-none focus:border-[#14b8a6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9ca3af]">Old Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#14b8a6]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#10b981]"
                    >
                      {showPasswords.old ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9ca3af]">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#14b8a6]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#10b981]"
                    >
                      {showPasswords.new ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9ca3af]">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#14b8a6]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#10b981]"
                    >
                      {showPasswords.confirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#047857] text-white py-3 rounded-xl font-semibold hover:from-[#059669] hover:to-[#065f46] transition-all duration-200 shadow-lg"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
