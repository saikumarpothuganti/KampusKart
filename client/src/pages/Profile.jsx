import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { 
  OrigamiLock, 
  OrigamiLogOut, 
  OrigamiCamera, 
  OrigamiUser, 
  OrigamiShield, 
  OrigamiCalendar, 
  OrigamiBag, 
  OrigamiPackage, 
  OrigamiStar, 
  OrigamiClipboard, 
  OrigamiChevronRight,
  OrigamiTag
} from '../components/OrigamiIcons';
import { X } from 'lucide-react'; // Keeping X just for the modal close button for simplicity, or we can use a basic button
import origamiLandscape from '../assets/origami_landscape.png';
import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';

const avatars = [profile1, profile2, profile3, profile4];

const Profile = () => {
  const { user, logout, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ placed: 0, delivered: 0, avgRating: 4.8 });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    userId: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const selectedAvatar = avatars[user?.avatarIndex || 0];
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchProfileAndOrders = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          API.get('/auth/profile'),
          API.get('/orders/my').catch(() => ({ data: [] }))
        ]);
        
        if (mounted) {
          setProfile(profileRes.data);
          setPasswordForm(prev => ({ ...prev, userId: profileRes.data.userId }));
          
          const orders = ordersRes.data || [];
          const placed = orders.length;
          const delivered = orders.filter(o => o.status === 'delivered').length;
          setStats({ placed, delivered, avgRating: 4.8 });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchProfileAndOrders();
    return () => { mounted = false; };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await API.post('/auth/change-password', {
        userId: passwordForm.userId,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      alert('Password changed successfully');
      setShowChangePassword(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleAvatarSelect = async (idx) => {
    try {
      await updateAvatar(idx);
      setShowAvatarModal(false);
    } catch (e) {
      alert('Failed to update avatar');
    }
  };

  if (loading) return <LoadingScreen duration={0} onFinished={() => {}} />;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4] text-red-500">Failed to load profile</div>;

  return (
    <div className="min-h-screen bg-[#F6F5ED] text-[#1D3525] py-12 px-6 lg:px-20 relative overflow-hidden font-sans">
      
      {/* Complete Background Origami Landscape */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img src={origamiLandscape} alt="Origami Landscape" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[#FDFCF9] rounded-3xl p-8 shadow-2xl max-w-lg w-full relative">
            <button 
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-3xl font-['Playfair_Display'] font-bold text-[#1a3625] mb-6 text-center">Choose Your Avatar</h3>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleAvatarSelect(idx)}
                  className={`relative rounded-2xl overflow-hidden border-4 transition-all duration-300 hover:scale-105 ${selectedAvatar === avatar ? 'border-[#388E3C] shadow-lg shadow-green-900/20' : 'border-transparent hover:border-green-200'}`}
                >
                  <img src={avatar} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover aspect-square" />
                  {selectedAvatar === avatar && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#388E3C] rounded-full flex items-center justify-center text-white shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-['Playfair_Display'] font-bold text-[#1a3625]">My Profile</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-1 w-12 bg-[#488A58] rounded-full"></div>
            <p className="text-gray-700 font-medium font-bold drop-shadow-sm">Manage your account details</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8">
          
          {/* Card 1: Account Details */}
          <div className="bg-[#FDFCF9]/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,125,50,0.1)] relative overflow-hidden border border-white/50">
            {/* Folded Paper Corners */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#8FAD8C] rounded-bl-3xl rounded-tr-3xl shadow-[-4px_4px_10px_rgba(0,0,0,0.1)] transition-transform hover:scale-110">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[64px] border-l-[64px] border-t-[#FDFCF9] border-l-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#488A58] rounded-tr-3xl rounded-bl-3xl shadow-[4px_-4px_10px_rgba(0,0,0,0.1)] transition-transform hover:scale-110">
               <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[64px] border-r-[64px] border-b-[#FDFCF9] border-r-transparent"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 mt-4 ml-2">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-[#E8F0E5] shadow-inner p-1 overflow-hidden relative">
                  <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                </div>
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-2 right-2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-[#2E7D32] hover:bg-gray-50 transition-colors border border-gray-100 hover:scale-110"
                  title="Change Profile Picture"
                >
                  <OrigamiCamera className="w-6 h-6" />
                </button>
              </div>

              {/* Name & Role */}
              <div className="pt-2 text-center sm:text-left flex-1 relative z-10">
                <h2 className="text-4xl font-['Playfair_Display'] font-bold text-[#1a3625] mb-2">{profile.name}</h2>
                <span className="inline-block px-4 py-1.5 bg-[#E8F0E5] text-[#2E7D32] font-semibold text-sm rounded-full mb-3 capitalize border border-[#D5E2D1] shadow-sm">
                  {profile.isAdmin ? 'Administrator' : (profile.isMarketing ? 'Marketing Man' : 'User')}
                </span>
                <p className="text-gray-500 font-medium">{profile.email}</p>
                
                {/* Dividers & Details */}
                <div className="mt-8 space-y-4">
                  <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F0E5] rounded-full flex items-center justify-center text-[#2E7D32] shadow-inner">
                      <OrigamiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">User ID</p>
                      <p className="font-bold text-[#1a3625]">{profile.userId}</p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F0E5] rounded-full flex items-center justify-center text-[#2E7D32] shadow-inner">
                      <OrigamiShield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Role</p>
                      <p className="font-bold text-[#1a3625] capitalize">{profile.isAdmin ? 'Admin' : (profile.isMarketing ? 'Marketing Man' : 'User')}</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F0E5] rounded-full flex items-center justify-center text-[#2E7D32] shadow-inner">
                      <OrigamiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Gender</p>
                      <p className="font-bold text-[#1a3625] capitalize">{profile.gender || 'Not Specified'}</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F0E5] rounded-full flex items-center justify-center text-[#2E7D32] shadow-inner">
                      <OrigamiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Member Since</p>
                      <p className="font-bold text-[#1a3625]">{new Date(profile.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                  
                  {profile.isMarketing && profile.referralCode && (
                    <>
                      <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#2E7D32] shadow-inner">
                          <OrigamiTag className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-green-800 font-medium mb-1">Your Referral Code</p>
                          <div className="flex items-center gap-3">
                            <code className="bg-white px-3 py-1 rounded text-[#1a3625] font-bold border border-green-200 text-lg tracking-widest">{profile.referralCode}</code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(profile.referralCode);
                                alert('Referral code copied to clipboard!');
                              }}
                              className="text-xs bg-[#488A58] text-white px-3 py-1.5 rounded hover:bg-[#3A764A] transition-colors font-bold shadow-sm"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 relative z-10 px-2 sm:px-4 mb-2">
              {showChangePassword ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input type="password" placeholder="Old Password" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#488A58]" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
                    <input type="password" placeholder="New Password" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#488A58]" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                    <input type="password" placeholder="Confirm Password" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#488A58]" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowChangePassword(false)} className="flex-1 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="flex-1 py-3 bg-[#488A58] text-white rounded-xl font-bold shadow-md">Save</button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-[#599A69] to-[#3A764A] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(72,138,88,0.3)] hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <OrigamiLock className="w-6 h-6" />
                    <span>Change Password</span>
                  </div>
                  <OrigamiChevronRight className="w-6 h-6" />
                </button>
              )}
              
              <button
                onClick={() => { logout(); navigate('/signin'); }}
                className="w-full flex items-center justify-between bg-[#FDFCF9] border border-red-200 text-red-500 px-6 py-4 rounded-2xl font-bold hover:bg-red-50 hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-3">
                  <OrigamiLogOut className="w-6 h-6" />
                  <span>Logout</span>
                </div>
                <OrigamiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Card 2: My Orders */}
          <div className="bg-[#FDFCF9]/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,125,50,0.1)] relative overflow-hidden flex flex-col h-full border border-white/50">
            {/* Bottom Right Fold */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#3A764A] rounded-tl-3xl rounded-br-3xl shadow-[-4px_-4px_10px_rgba(0,0,0,0.1)] transition-transform hover:scale-110">
               <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[64px] border-l-[64px] border-b-[#FDFCF9] border-l-transparent"></div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#1a3625]">My Orders</h2>
              <div className="h-1 w-12 bg-[#488A58] rounded-full mt-3"></div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-1">
              
              {/* Orders Placed */}
              <div className="bg-[#F6F8F5] border border-[#E8F0E5] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform relative z-10">
                   <OrigamiBag className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-[#1a3625] mb-1 relative z-10">{stats.placed}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium text-center relative z-10">Orders Placed</p>
                {/* Decorative mountain background */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#D5E2D1] to-transparent opacity-40 pointer-events-none skew-y-12 translate-y-4"></div>
              </div>

              {/* Delivered */}
              <div className="bg-[#F6F8F5] border border-[#E8F0E5] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform relative z-10">
                   <OrigamiPackage className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-[#1a3625] mb-1 relative z-10">{stats.delivered}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium text-center relative z-10">Delivered</p>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#D5E2D1] to-transparent opacity-40 pointer-events-none -skew-y-12 translate-y-4"></div>
              </div>

              {/* Avg Rating */}
              <div className="bg-[#F6F8F5] border border-[#E8F0E5] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform relative z-10">
                   <OrigamiStar className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-[#1a3625] mb-1 relative z-10">{stats.avgRating}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium text-center relative z-10">Avg Rating</p>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#D5E2D1] to-transparent opacity-40 pointer-events-none skew-y-12 translate-y-4"></div>
              </div>
            </div>

            {/* View All Orders Button */}
            <button
              onClick={() => navigate('/order-history')}
              className="mt-6 sm:mt-8 w-full flex items-center justify-between bg-[#E8F0E5] border border-[#D5E2D1] p-4 rounded-2xl hover:bg-[#DFEDD7] hover:scale-[1.01] transition-all relative z-10"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <OrigamiClipboard className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[#1a3625] text-base sm:text-lg">View All My Orders</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Track, manage and reorder</p>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3A764A] rounded-full flex items-center justify-center text-white shadow-md">
                <OrigamiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </button>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
