import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import ContactLinks from '../components/ContactLinks';
import QRCode from '../assets/QRPhonepayg.jpeg';

const groupBySideType = (items = []) => {
  const singles = [];
  const doubles = [];
  items.forEach((item) => {
    const type = item.sideType || (item.sides === 2 ? 'double' : 'single');
    if (type === 'double') doubles.push(item);
    else singles.push(item);
  });
  return { singles, doubles };
};

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [paymentType, setPaymentType] = useState('FULL');
  const [paidNow, setPaidNow] = useState('');

  // Check if order is bulk: total amount >= ₹1000
  const isBulkOrder = () => {
    const totalAmount = getTotalPrice();
    return totalAmount >= 1000;
  };

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

    // Validate Partial Payment amount if selected
    if (paymentType === 'PARTIAL') {
      const total = getTotalPrice();
      const paid = Number(paidNow);
      if (!Number.isFinite(paid) || paid <= 0) {
        setErrorMsg('Enter a valid payment amount (> 0)');
        return;
      }
      if (paid >= total) {
        setErrorMsg('Partial payment amount must be less than total');
        return;
      }
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
      const payload = {
        items: cart.items,
        amount: getTotalPrice(),
        paymentScreenshotUrl: screenshotUrl,
        paymentType: paymentType === 'PARTIAL' ? 'COD' : 'FULL',
        paidAmount: paymentType === 'PARTIAL' ? Number(paidNow) : getTotalPrice(),
        remainingAmount:
          paymentType === 'PARTIAL' ? Math.max(getTotalPrice() - Number(paidNow), 0) : 0,
        student: {
          name: checkoutData.name,
          collegeId: checkoutData.collegeId,
          phone: checkoutData.phone,
        },
        pickupPoint: checkoutData.pickupPoint || 'Main Gate',
        notes: checkoutData.notes,
      };

      const orderRes = await API.post('/orders', payload);

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
  const grouped = groupBySideType(cart.items || []);

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
          {/* Payment Type Selector */}
          {needsPayment && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">Payment Type</label>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="FULL"
                    checked={paymentType === 'FULL'}
                    onChange={() => setPaymentType('FULL')}
                  />
                  <span className="text-sm text-black">Full Payment</span>
                </label>
                {isBulkOrder() && (
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      value="PARTIAL"
                      checked={paymentType === 'PARTIAL'}
                      onChange={() => setPaymentType('PARTIAL')}
                    />
                    <span className="text-sm text-black">Partial Payment (Pay now, rest on delivery)</span>
                  </label>
                )}
              </div>
              {paymentType === 'PARTIAL' && (
                <div className="mt-3">
                  <label className="block text-sm text-black mb-1">Enter amount you are paying now</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paidNow}
                    onChange={(e) => setPaidNow(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder={`Less than ₹${total.toFixed(2)}`}
                  />
                  {paidNow && Number(paidNow) > 0 && Number(paidNow) < total && (
                    <p className="mt-1 text-xs text-black">
                      Remaining on delivery: ₹{(total - Number(paidNow)).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
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
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-black mb-2">Contact us for faster order confirmation:</p>
              <ContactLinks />
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

          {/* Group: Single-side */}
          <div className="space-y-2 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
            {grouped.singles.length > 0 && (
              <p className="text-sm font-semibold text-black">Single-side</p>
            )}
            {grouped.singles.map((item, idx) => (
              <div key={`s-${idx}`} className="flex flex-col border rounded p-2">
                <div className="flex justify-between text-sm text-black">
                  <span className="font-semibold">{item.title} {item.code ? `(${item.code})` : ''}</span>
                  {item.userPrice ?? item.price ? (
                    <span>₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</span>
                  ) : (
                    <span className="text-black">Pending admin price</span>
                  )}
                </div>
                <div className="text-xs text-black mt-1">
                  <span>Print: Single</span> · <span>Qty: {item.qty}</span> · <span>Price/page: ₹{item.pricePerPage ?? (item.userPrice ?? item.price ?? '-')}</span>
                </div>
              </div>
            ))}
            {grouped.doubles.length > 0 && (
              <p className="mt-3 text-sm font-semibold text-black">Double-side</p>
            )}
            {grouped.doubles.map((item, idx) => (
              <div key={`d-${idx}`} className="flex flex-col border rounded p-2">
                <div className="flex justify-between text-sm text-black">
                  <span className="font-semibold">{item.title} {item.code ? `(${item.code})` : ''}</span>
                  {item.userPrice ?? item.price ? (
                    <span>₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</span>
                  ) : (
                    <span className="text-black">Pending admin price</span>
                  )}
                </div>
                <div className="text-xs text-black mt-1">
                  <span>Print: Double</span> · <span>Qty: {item.qty}</span> · <span>Price/page: ₹{item.pricePerPage ?? (item.userPrice ?? item.price ?? '-')}</span>
                </div>
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
