import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Navbar from './components/Navbar';
import Background from './components/Background';
import LoadingScreen from './components/LoadingScreen';
import InstallPrompt from './components/InstallPrompt';

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
import Admin from './pages/Admin';
import DeliveryLocation from './pages/DeliveryLocation';
import Feedback from './pages/Feedback';

import './index.css';

function AppContent() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const { isLoading } = useLoading();

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Initial load screen */}
      {showInitialLoader && (
        <LoadingScreen duration={2500} onFinished={() => setShowInitialLoader(false)} />
      )}
      {/* Button click loader */}
      {isLoading && (
        <LoadingScreen duration={5000} onFinished={() => {}} />
      )}
      {/* PWA Install Prompt */}
      <InstallPrompt />
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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/delivery/update-location/:orderId" element={<DeliveryLocation />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
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
