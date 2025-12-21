import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import OrderCard from '../components/OrderCard';
import LoadingScreen from '../components/LoadingScreen';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [pdfRequests, setPdfRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, pdfRequestsRes] = await Promise.all([
        API.get('/orders/my'),
        API.get('/pdf-requests/my'),
      ]);
      setOrders(ordersRes.data);
      setPdfRequests(pdfRequestsRes.data);
    } catch (error) {
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPDFToCart = async (request) => {
    try {
      await addToCart({
        type: 'custom',
        title: request.title,
        pdfUrl: request.pdfUrl,
        qty: request.qty,
        sideType: request.sides === 2 ? 'double' : 'single', // CRITICAL: Set sideType explicitly
        sides: request.sides, // Keep for backwards compatibility
        userPrice: request.price,
      });
      await API.post(`/pdf-requests/${request.requestId}/add-to-cart`);
      fetchData();
      alert('Added to cart! Go to cart to checkout.');
      navigate('/cart');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const handleCancelPDFRequest = async (requestId) => {
    if (!window.confirm('Cancel this PDF request?')) return;
    try {
      await API.post(`/pdf-requests/${requestId}/cancel`);
      fetchData();
      alert('Request cancelled');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel request');
    }
  };

  if (loading) {
    return <LoadingScreen duration={0} onFinished={() => {}} />;
  }

  const activePDFRequests = pdfRequests.filter((r) => r.status !== 'added_to_cart' && r.status !== 'cancelled');

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 text-[#e5e7eb]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8">📜 Orders and PDF Status</h1>

      {activePDFRequests.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>📄 Custom PDF Requests</span>
            <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">{activePDFRequests.length}</span>
          </h2>
          <div className="space-y-4">
            {activePDFRequests.map((request) => (
              <div key={request._id} className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[18px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-[#9ca3af]">Request ID</p>
                    <p className="text-xl font-bold text-[#14b8a6]">{request.requestId}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-500 text-white' :
                    request.status === 'priced' ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {request.status === 'pending' ? 'Waiting for Price' : request.status === 'priced' ? 'Price Set' : request.status}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-lg mb-1">{request.title}</p>
                  <p className="text-sm text-[#9ca3af]">Qty: {request.qty} | Sides: {request.sides === 1 ? 'Single' : 'Double'}</p>
                  <a href={request.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[#14b8a6] hover:underline text-sm inline-block mt-1">📄 View PDF →</a>
                </div>

                {request.status === 'priced' ? (
                  <div>
                    <div className="mb-4 p-3 rounded bg-green-900/20 border border-green-500/30">
                      <p className="text-green-400 font-semibold">✓ Admin has set the price</p>
                      <p className="text-xl font-bold text-white mt-1">Price: ₹{request.price} × {request.qty} = ₹{(request.price * request.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleAddPDFToCart(request)} className="flex-1 bg-gradient-to-r from-[#059669] to-[#047857] text-white py-3 rounded-full font-semibold hover:scale-[1.02] transition">🛒 Add to Cart</button>
                      <button onClick={() => handleCancelPDFRequest(request.requestId)} className="px-6 bg-red-500/20 border border-red-500/50 text-red-400 py-3 rounded-full font-semibold hover:bg-red-500/30 transition">✗ Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="p-3 rounded bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-sm flex-1">⏳ Waiting for admin to set the price...</div>
                    <button onClick={() => handleCancelPDFRequest(request.requestId)} className="ml-3 px-4 bg-red-500/20 border border-red-500/50 text-red-400 py-2 rounded-full text-sm font-semibold hover:bg-red-500/30 transition">Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Orders</h2>
        {orders.length === 0 && activePDFRequests.length === 0 ? (
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[18px] p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <p className="text-[#9ca3af] mb-4">You haven't placed any orders yet.</p>
            <a href="/workbook" className="text-[#14b8a6] font-semibold hover:underline">Start Shopping</a>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-[#9ca3af]">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
