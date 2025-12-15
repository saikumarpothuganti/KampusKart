import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NavLink from './NavLink';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasFetchedCart = React.useRef(false);

  React.useEffect(() => {
    // Only fetch cart once when user is logged in
    if (user && !hasFetchedCart.current) {
      hasFetchedCart.current = true;
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleScrollToFooter = (section) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Workbook', to: '/workbook' },
    { label: 'About', scroll: 'about' },
    { label: 'Services', scroll: 'services' },
    { label: 'Feedback', to: '/feedback' },
  ];

  return (
    <nav className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-[rgba(15,17,22,0.75)] border-b border-[rgba(255,255,255,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#059669] shadow-lg bg-[#0f1116] flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(5,150,105,0.6), inset 0 0 10px rgba(5,150,105,0.2)' }}>
              <img src={logo} alt="KampusKart" className="max-w-full max-h-full object-contain" />
            </div>
            <p className="text-[#e5e7eb] text-lg font-semibold">KampusKart</p>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              link.scroll ? (
                <button
                  key={link.label}
                  onClick={() => handleScrollToFooter(link.scroll)}
                  className="text-[#cbd5e1] hover:text-[#059669] transition"
                >
                  {link.label}
                </button>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-[#cbd5e1] hover:text-[#059669] transition"
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <NavLink
                to="/cart"
                className="text-xl text-[#e5e7eb] hover:text-[#059669] transition"
                title="Cart"
              >
                🛒
              </NavLink>
              {cart.items && cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                  {cart.items.length}
                </span>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#059669] to-[#047857] text-[#0f1116] flex items-center justify-center font-bold text-sm shadow-lg"
                style={{ boxShadow: '0 0 15px rgba(5,150,105,0.4)' }}
              >
                {user ? user.name[0].toUpperCase() : '?'}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.45)] w-52 z-50 overflow-hidden">
                  {user ? (
                    <>
                      {user.isAdmin && (
                        <NavLink
                          to="/admin"
                          className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5 border-b border-[rgba(255,255,255,0.08)]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          🛡️ Admin Dashboard
                        </NavLink>
                      )}
                      <NavLink
                        to="/profile"
                        className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </NavLink>
                      <NavLink
                        to="/order-history"
                        className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Orders and PDF Status
                      </NavLink>
                      <NavLink
                        to="/feedback"
                        className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Feedback
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/signin"
                        className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign In
                      </NavLink>
                      <NavLink
                        to="/signup"
                        className="block px-4 py-3 text-sm text-[#e5e7eb] hover:bg-white/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
