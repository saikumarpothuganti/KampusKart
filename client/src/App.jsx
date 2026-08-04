import React, { useState, Suspense } from 'react';
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
import FloatingCodefora from './components/FloatingCodefora';
import CodeforaAd from './components/CodeforaAd';

const Home = React.lazy(() => import('./pages/Home'));
const Workbook = React.lazy(() => import('./pages/Workbook'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Payment = React.lazy(() => import('./pages/Payment'));
const OrderStatus = React.lazy(() => import('./pages/OrderStatus'));
const OrderHistory = React.lazy(() => import('./pages/OrderHistory'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Admin = React.lazy(() => import('./pages/Admin'));
const DeliveryLocation = React.lazy(() => import('./pages/DeliveryLocation'));
const SupplierDashboard = React.lazy(() => import('./pages/SupplierDashboard'));
const Feedback = React.lazy(() => import('./pages/Feedback'));
const About = React.lazy(() => import('./pages/About'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Refund = React.lazy(() => import('./pages/Refund'));
const Shipping = React.lazy(() => import('./pages/Shipping'));
const LuckyWheel = React.lazy(() => import('./pages/LuckyWheel'));


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
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={user?.isSupplier ? <Navigate to="/supplier" replace /> : <Home />} />
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
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/delivery-location/:orderId" element={<DeliveryLocation />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/lucky-wheel" element={<LuckyWheel />} />
        </Routes>
      </Suspense>
      <FloatingChat />
      <FloatingCodefora />
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
