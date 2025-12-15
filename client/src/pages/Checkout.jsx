import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getTotalPrice } = useCart();
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
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
    if (!formData.name || !formData.collegeId || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    // Store checkout data in localStorage for next page
    localStorage.setItem('checkoutData', JSON.stringify(formData));
    navigate('/payment');
  };

  const total = getTotalPrice();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8">📋 Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Your Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">College ID *</label>
              <input
                type="text"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Your College ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Pickup Address</label>
              <input
                type="text"
                disabled
                value="KL University, Vaddeswaram"
                className="w-full border rounded px-3 py-2 bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Pickup Point Inside Campus *</label>
              <select
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
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
              <label className="block text-sm font-medium mb-2 text-black">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Any special instructions..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary text-lg"
            >
              Continue to Payment
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>

          <div className="space-y-2 mb-4 pb-4 border-b">
            {cart.items && cart.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-black">
                <span>{item.title} x {item.qty}</span>
                {item.userPrice ?? item.price ? (
                  <span>₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</span>
                ) : (
                  <span className="text-black">Pending admin price</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-black">Total:</span>
            <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>
          {total === 0 && (
            <p className="mt-2 text-xs text-black">Total excludes custom PDFs; admin will set price.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
