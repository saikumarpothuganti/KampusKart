import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import { SOCKET_URL, SOCKET_CONFIG } from '../config.js';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import ContactLinks from '../components/ContactLinks';
import LoadingScreen from '../components/LoadingScreen';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchOrder();
  }, [user, orderId]);

  // Setup socket for live location when allowed
  useEffect(() => {
    if (!order || !order.liveLocationEnabled) {
      if (socket) socket.disconnect();
      return;
    }

    const s = io(SOCKET_URL, SOCKET_CONFIG);
    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected for order', orderId);
      s.emit('joinOrder', { orderId });
    });

    s.on(`deliveryLocation:${orderId}`, (loc) => {
      setLiveLocation(loc);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      s.disconnect();
    };
  }, [order, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      alert('Order not found');
      navigate('/order-history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const res = await API.post(`/orders/${orderId}/cancel`);
      setOrder(res.data);
      alert('Order cancelled successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingScreen duration={0} onFinished={() => {}} />;
  }

  if (!order) {
    return <div className="max-w-4xl mx-auto py-8 px-4 text-center">Order not found</div>;
  }

  const klLocation = { lat: 16.4419, lng: 80.6220 };
  const showLive = order.liveLocationEnabled && (order.status === 'printing' || order.status === 'out_for_delivery');
  const markerPosition = showLive && liveLocation ? liveLocation : klLocation;

  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const getStatusMessage = () => {
    if (order.status === 'pending_price') {
      if (order.priceSetByAdmin) {
        return '✓ Admin has set the price! Go to Orders and PDF Status to review and accept.';
      }
      return '⏳ Custom PDF request submitted. Waiting for admin to set the price.';
    }
    const messages = {
      sent: 'Order sent. Waiting for confirmation.',
      placed: 'Order placed. We are preparing your items.',
      printing: 'Your items are being printed.',
      delivered: 'Order delivered! Thank you for your purchase.',
      cancelled: 'Order cancelled.',
    };
    return messages[order.status] || '';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-2 text-white">📦 Order Status</h1>
      <p className="text-white mb-6">Order ID: <span className="font-bold text-primary">{order.orderId}</span></p>

      {/* Timeline */}
      {order.status !== 'cancelled' && <OrderStatusTimeline status={order.status} />}

      {/* Status Message */}
      <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg shadow-lg p-4 mb-6 text-center">
        <p className="text-white font-semibold">{getStatusMessage()}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
        <p className="text-gray-800 font-semibold">Estimated delivery: {order.deliveryDays ?? 3} days</p>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg shadow-lg p-6 mb-6 text-center">
        <p className="text-white font-semibold mb-4">📞 For better communication about your order, please contact us:</p>
        <ContactLinks />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-bold mb-3 text-black">Live Delivery Map</h2>
        <div className="h-72 w-full rounded overflow-hidden">
          <MapContainer center={markerPosition} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition} icon={markerIcon}>
              <Popup>
                {showLive && liveLocation
                  ? 'Delivery in progress'
                  : 'KL University (tracking starts after printing)'}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        {!showLive && (
          <p className="mt-3 text-sm text-black">
            Delivery tracking will be available once your order is printed.
          </p>
        )}
      </div>

      {/* Payment Screenshot */}
      {order.payment?.screenshotUrl && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Payment Screenshot</h2>
          <img
            src={order.payment.screenshotUrl}
            alt="Payment Screenshot"
            className="max-w-md rounded border"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Screenshot+Not+Available';
            }}
          />
        </div>
      )}

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Items */}
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Order Items</h2>
          {(() => {
            const singles = [];
            const doubles = [];
            (order.items || []).forEach((item) => {
              const type = item.sideType || (item.sides === 2 ? 'double' : 'single');
              if (type === 'double') doubles.push(item);
              else singles.push(item);
            });
            return (
              <div className="space-y-3">
                {singles.length > 0 && (
                  <p className="text-sm font-semibold text-white">Single-side</p>
                )}
                {singles.map((item, idx) => (
                  <div key={`s-${idx}`} className="flex flex-col border-b border-white/20 pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.title} {item.code ? `(${item.code})` : ''}</p>
                        <p className="text-xs text-white/90">Print: Single · Qty: {item.qty} · Price/page: ₹{item.pricePerPage ?? (item.userPrice ?? item.price ?? '-')}</p>
                      </div>
                      {item.userPrice ?? item.price ? (
                        <p className="font-bold text-white">₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</p>
                      ) : (
                        <p className="text-white text-sm">Pending admin price</p>
                      )}
                    </div>
                  </div>
                ))}
                {doubles.length > 0 && (
                  <p className="mt-2 text-sm font-semibold text-white">Double-side</p>
                )}
                {doubles.map((item, idx) => (
                  <div key={`d-${idx}`} className="flex flex-col border-b border-white/20 pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.title} {item.code ? `(${item.code})` : ''}</p>
                        <p className="text-xs text-white/90">Print: Double · Qty: {item.qty} · Price/page: ₹{item.pricePerPage ?? (item.userPrice ?? item.price ?? '-')}</p>
                      </div>
                      {item.userPrice ?? item.price ? (
                        <p className="font-bold text-white">₹{((item.userPrice ?? item.price) * item.qty).toFixed(2)}</p>
                      ) : (
                        <p className="text-white text-sm">Pending admin price</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
          <div className="mt-4 pt-4 border-t border-white/30 flex justify-between font-bold text-lg text-white">
            <span>Total:</span>
            <span className="text-yellow-300">₹{order.amount}</span>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Student Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/80">Name</p>
              <p className="font-semibold text-white">{order.student.name}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">College ID</p>
              <p className="font-semibold text-white">{order.student.collegeId}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Phone</p>
              <p className="font-semibold text-white">{order.student.phone}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Pickup Address</p>
              <p className="font-semibold text-white">{order.pickupAddress}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-white/80">Notes</p>
                <p className="font-semibold text-white">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {(order.status === 'sent' || order.status === 'placed' || order.status === 'printing') && (
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6 text-center">
          <p className="text-red-700 font-bold text-lg">⚠️ Orders cannot be cancelled after being placed</p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {order.status === 'sent' && order.canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
        {order.status === 'delivered' && (
          <p className="text-green-600 font-semibold">✓ Order Delivered</p>
        )}
        {order.status === 'cancelled' && (
          <p className="text-red-600 font-semibold">✗ Order Cancelled</p>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-black mb-4">Need help with your order?</p>
        <ContactLinks />
      </div>
    </div>
  );
};

export default OrderStatus;
