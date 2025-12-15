import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config.js';

const DeliveryLocation = () => {
  const { orderId } = useParams();
  const [connected, setConnected] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.io
    const newSocket = io(SOCKET_URL, SOCKET_CONFIG);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
      newSocket.emit('joinOrder', { orderId });
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    if (!socket) return;

    let watchId;

    // Watch user's location continuously
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Send location to server
          socket.emit('updateDeliveryLocation', {
            orderId,
            lat: latitude,
            lng: longitude,
          });

          console.log('Location sent:', latitude, longitude);
        },
        (err) => {
          setError(`Error: ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, orderId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
        >
          <span className="text-yellow-400 font-bold text-lg">←</span>
          <span className="font-semibold">Back</span>
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center">📍 Delivery Location Tracker</h1>
        <p className="text-gray-600 text-center mb-6">
          Order ID: <span className="font-bold text-primary">{orderId}</span>
        </p>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-semibold">
              {connected ? '🟢 Connected to Server' : '🔴 Disconnected'}
            </span>
          </div>

          {/* Location Status */}
          {location && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-700 font-semibold mb-2">✓ Live location sharing active</p>
              <p className="text-sm text-gray-600">
                Lat: {location.lat.toFixed(6)}<br />
                Lng: {location.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-gray-700">
              📱 Keep this page open while delivering the order. Your location will be shared in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocation;
