import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { OrigamiPackage, OrigamiClipboard, OrigamiTag, OrigamiStar } from '../components/OrigamiIcons';
import API from '../lib/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, ordersEnabled } = useAuth();
  const { getActiveCart, getActiveCartTotalPrice } = useCart();
  const cart = getActiveCart() || {};
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [pauseMessage, setPauseMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    collegeId: '',
    phone: '',
    pickupPoint: '',
    notes: '',
  });

  useEffect(() => {
    fetchPickupPoints();
  }, []);

  useEffect(() => {
    if (!ordersEnabled) {
      if (!user || !user.isAdmin) {
        alert(
          "We've received more orders than expected.\n" +
          "Orders are temporarily paused.\n" +
          "Please check back shortly or contact admin for urgent needs."
        );
        navigate('/');
      }
    }
  }, [ordersEnabled, navigate, user]);

  const fetchPickupPoints = async () => {
    try {
      const response = await API.get('/pickup-points');
      setPickupPoints(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          pickupPoint: response.data[0].name
        }));
      }
      setLoadingPoints(false);
    } catch (error) {
      console.error('Failed to fetch pickup points:', error);
      setLoadingPoints(false);
    }
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ordersEnabled) {
      if (!user || !user.isAdmin) {
        alert(
          "We've received more orders than expected.\n" +
          "Orders are temporarily paused.\n" +
          "Please check back shortly or contact admin for urgent needs."
        );
        return;
      }
    }
    if (!formData.name || !formData.collegeId || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    // Store checkout data in localStorage for next page
    localStorage.setItem('checkoutData', JSON.stringify(formData));
    navigate('/payment');
  };

  const total = getActiveCartTotalPrice();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-[#FAF8F2] border-2 border-[#18382A] text-[#18382A] font-bold rounded-sm shadow-[4px_4px_0px_#18382A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#18382A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
      >
        <span className="text-xl font-black">←</span>
        <span>Back</span>
      </button>
      <h1 className="text-4xl font-serif font-black mb-10 flex items-center gap-4 text-ink drop-shadow-sm">
        <span className="filter drop-shadow-md"><OrigamiPackage className="w-12 h-12 text-[#18382A]" /></span> 
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2 taped-paper p-8 relative"
          style={{
            boxShadow: '6px 6px 0px #18382A',
            border: '2px solid #18382A',
            backgroundColor: '#FAF8F2'
          }}>
          <div className="absolute -top-4 -left-4 z-10" style={{ transform: 'rotate(-15deg)' }}>
            <OrigamiClipboard className="w-10 h-10 text-ink drop-shadow-md" />
          </div>
          <div className="absolute -bottom-6 -right-4 z-10" style={{ transform: 'rotate(25deg)' }}>
            <OrigamiStar className="w-12 h-12 text-green-800 drop-shadow-md" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-sm px-4 py-3 shadow-inner focus:outline-none focus:border-ink/50 transition-colors"
                placeholder="Your Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">College ID *</label>
              <input
                type="text"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-sm px-4 py-3 shadow-inner focus:outline-none focus:border-ink/50 transition-colors"
                placeholder="Your College ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-sm px-4 py-3 shadow-inner focus:outline-none focus:border-ink/50 transition-colors"
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">Pickup Address</label>
              <input
                type="text"
                disabled
                value="KL University, Vaddeswaram"
                className="w-full bg-ink/5 border-2 border-ink/20 text-ink/70 font-bold rounded-sm px-4 py-3 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">Pickup Point Inside Campus *</label>
              <select
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                className="w-full bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-sm px-4 py-3 shadow-inner focus:outline-none focus:border-ink/50 transition-colors"
                required
                disabled={loadingPoints}
              >
                {loadingPoints ? (
                  <option>Loading pickup points...</option>
                ) : pickupPoints.length === 0 ? (
                  <option>No pickup points available</option>
                ) : (
                  pickupPoints.map((point) => (
                    <option key={point._id} value={point.name}>
                      {point.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-ink mb-2 uppercase tracking-widest">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-sm px-4 py-3 shadow-inner focus:outline-none focus:border-ink/50 transition-colors"
                placeholder="Any special instructions..."
                rows="4"
              />
            </div>

            {pauseMessage && (
              <div className="text-sm text-amber-700 bg-amber-100 border border-amber-300 rounded-lg p-3">
                {pauseMessage}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 rounded-sm font-black text-lg uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                ordersEnabled 
                ? 'bg-[#18382A] border-[#18382A] text-paper shadow-[4px_4px_0px_#B8860B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#B8860B] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none' 
                : 'bg-ink/50 border-ink/50 text-paper/50 cursor-not-allowed shadow-none'
              }`}
            >
              Continue to Payment <span>→</span>
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="taped-paper p-8 h-fit relative transform rotate-1"
          style={{
            boxShadow: '6px 6px 0px #18382A',
            border: '2px solid #18382A',
            backgroundColor: '#FAF8F2'
          }}>
          <div className="absolute -top-5 right-4 z-10" style={{ transform: 'rotate(10deg)' }}>
            <OrigamiTag className="w-10 h-10 text-ink drop-shadow-md" />
          </div>
          
          <h2 className="text-2xl font-serif font-black mb-6 text-ink border-b-2 border-dashed border-ink/20 pb-4 flex items-center gap-3">
            <OrigamiClipboard className="w-8 h-8 text-ink" /> Order Summary
          </h2>

          <div className="space-y-3 mb-6 pb-6 border-b-2 border-dashed border-ink/20">
            {cart.items && cart.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm font-bold text-ink/90">
                <span className="uppercase">{item.title} x {item.qty}, sides-{item.sides || 1}, {item.quality || 'standard'}</span>
                {item.userPrice ?? item.price ? (
                  <span className="text-ink">₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</span>
                ) : (
                  <span className="text-amber-600 italic">Pending Price</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end mb-2">
            <span className="font-serif font-black text-xl text-ink">Total:</span>
            <span className="text-3xl font-black text-ink" style={{ textShadow: '2px 2px 0px rgba(184,134,11,0.5)' }}>₹{total.toFixed(2)}</span>
          </div>
          {total === 0 && (
            <p className="mt-4 text-xs font-bold text-amber-700 bg-amber-100 p-2 border border-amber-300 rounded-sm italic text-center">
              * Total excludes custom PDFs (Admin will price them)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
