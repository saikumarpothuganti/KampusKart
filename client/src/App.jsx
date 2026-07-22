import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Navbar from './components/Navbar';
import Background from './components/Background';
import LoadingScreen from './components/LoadingScreen';
import InstallPrompt from './components/InstallPrompt';
import NotificationPrompt from './components/NotificationPrompt';
import FloatingChat from './components/FloatingChat';

import Home from './pages/Home';
import Workbook from './pages/Workbook';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderStatus from './pages/OrderStatus';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Admin from './pages/Admin';
import DeliveryLocation from './pages/DeliveryLocation';
import Feedback from './pages/Feedback';
import About from './pages/About';

import './index.css';

function AppContent() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const { isLoading } = useLoading();
  const { user } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Only trigger route loading if initial load is finished
    if (!showInitialLoader) {
      setIsRouteLoading(true);
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Initial load screen */}
      {showInitialLoader && (
        <LoadingScreen duration={2000} onFinished={() => setShowInitialLoader(false)} />
      )}
      {/* Route Transition Loader */}
      {!showInitialLoader && isRouteLoading && (
        <LoadingScreen duration={1500} onFinished={() => setIsRouteLoading(false)} />
      )}
      {/* Button click loader */}
      {isLoading && (
        <LoadingScreen duration={5000} onFinished={() => {}} />
      )}
      {/* PWA Install Prompt */}
      <InstallPrompt />
      {/* PWA Notification Prompt */}
      <NotificationPrompt />
      <Background />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workbook" element={<Workbook />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/delivery/update-location/:orderId" element={<DeliveryLocation />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <FloatingChat />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
