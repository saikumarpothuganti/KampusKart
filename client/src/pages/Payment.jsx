import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import ContactLinks from '../components/ContactLinks';
import QRCode from '../assets/QR.jpg';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const data = localStorage.getItem('checkoutData');
    if (!data) {
      navigate('/checkout');
      return;
    }
    setCheckoutData(JSON.parse(data));
  }, [user, navigate]);

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    setScreenshot(file || null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleConfirmPayment = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    const hasPendingPrice = cart.items?.some((item) => item.userPrice == null && item.price == null);
    const needsPayment = getTotalPrice() > 0 && !hasPendingPrice;

    if (needsPayment && !screenshot) {
      setErrorMsg('Please upload a payment screenshot');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }
    if (!checkoutData) {
      setErrorMsg('Missing checkout details');
      navigate('/checkout');
      return;
    }

    try {
      setUploading(true);

      let screenshotUrl = null;
      if (needsPayment) {
        const formData = new FormData();
        formData.append('screenshot', screenshot);

        const uploadRes = await API.post('/upload/screenshot', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (!uploadRes?.data?.url) {
          throw new Error('Screenshot upload failed: missing URL');
        }
        screenshotUrl = uploadRes.data.url;
      }

      // Create order
      const orderRes = await API.post('/orders', {
        items: cart.items,
        amount: getTotalPrice(),
        paymentScreenshotUrl: screenshotUrl,
        student: {
          name: checkoutData.name,
          collegeId: checkoutData.collegeId,
          phone: checkoutData.phone,
        },
        pickupPoint: checkoutData.pickupPoint || 'Main Gate',
        notes: checkoutData.notes,
      });

      if (!orderRes?.data?.orderId) {
        throw new Error('Order creation failed: missing orderId');
      }

      localStorage.removeItem('checkoutData');
      await clearCart();
      setSuccessMsg('Payment confirmed! Redirecting to feedback...');
      setTimeout(() => navigate('/feedback'), 600);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to process payment';
      setErrorMsg(msg);
    } finally {
      setUploading(false);
    }
  };

  const total = getTotalPrice();
  const hasPendingPrice = cart.items?.some((item) => item.userPrice == null && item.price == null);
  const needsPayment = total > 0 && !hasPendingPrice;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8">💳 Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {hasPendingPrice && (
            <div className="mb-4 p-3 rounded border border-yellow-200 bg-yellow-50 text-sm text-yellow-800">
              Custom PDFs have a price that will be set by admin. You won&apos;t be charged now; final amount will be confirmed later.
            </div>
          )}

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-black mb-3">
              📱 Scan the QR code below and complete the payment:
            </p>
            <div className="bg-white p-4 rounded text-center">
              <p className="text-black text-sm mb-2">QR Code</p>
              <div className="w-64 h-64 mx-auto rounded overflow-hidden">
                <img src={QRCode} alt="Payment QR Code" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="mb-6 border-b pb-6">
            <div className="flex justify-between items-center text-lg font-bold text-black">
              <span>Total Amount:</span>
              <span className="text-primary text-2xl">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {total === 0 && (
            <div className="mb-4 p-3 rounded border border-blue-200 bg-blue-50 text-sm text-blue-800">
              No upfront payment needed because item pricing is pending admin review.
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded border border-green-200 bg-green-50 text-green-700 text-sm">
              {successMsg}
            </div>
          )}

          {needsPayment ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-black">
                Upload Payment Screenshot (JPG/PNG) *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="w-full border rounded px-3 py-2 mb-2"
                required
              />
              {screenshot && (
                <div className="mt-2">
                  <p className="text-sm text-black">Selected: {screenshot.name}</p>
                  <div className="mt-2 w-40 h-40 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(screenshot)}
                      alt="Payment screenshot preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-3 rounded border border-green-200 bg-green-50 text-sm text-green-800">
              Payment screenshot not needed now. Admin will set the price and collect payment later.
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            disabled={uploading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary text-lg disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Confirm Payment'}
          </button>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-black mb-3">Need help?</p>
            <ContactLinks />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>

          <div className="space-y-2 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
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

          <div className="space-y-2 text-sm mb-4 pb-4 border-b text-black">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-black">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>

          {hasPendingPrice && (
            <p className="mt-2 text-xs text-black">Total does not include custom PDFs; admin will finalize pricing.</p>
          )}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-black">
            <p>📍 Pickup: KL University, Vaddeswaram</p>
            <p>👤 Name: {checkoutData?.name}</p>
            <p>🎓 College ID: {checkoutData?.collegeId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
