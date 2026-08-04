import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NavLink from './NavLink';
import TreeBranchDivider from './TreeBranchDivider';
import API from '../lib/api';
import logo from '../assets/logo2.png';
import { NavbarDecorations } from './NavbarDecorations';
import { OrigamiCart } from './OrigamiIcons';
import InboxDropdown from './InboxDropdown';
import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';
import CodeforaAd from './CodeforaAd';

const avatars = [profile1, profile2, profile3, profile4];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasFetchedCart = React.useRef(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;

      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about');
      
      let current = 'Home';
      if (aboutEl && aboutEl.getBoundingClientRect().top < window.innerHeight / 2) {
        current = 'About';
      } else if (servicesEl && servicesEl.getBoundingClientRect().top < window.innerHeight / 2) {
        current = 'Services';
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const notifStatusKey = React.useMemo(() => {
    if (!user) return null;
    const id = user.userId || user._id || user.id || 'me';
    return `kk_pdf_statuses_${id}`;
  }, [user]);

  const loadPdfNotifications = React.useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get('/pdf-requests/my');
      const requests = res.data || [];
      const prevRaw = notifStatusKey ? localStorage.getItem(notifStatusKey) : null;
      const prev = prevRaw ? JSON.parse(prevRaw) : {};
      const nextMap = {};
      const newNotifs = [];

      for (const r of requests) {
        nextMap[r.requestId] = r.status;
        const before = prev[r.requestId];
        if (before && before !== r.status && r.status === 'priced') {
          newNotifs.push({
            id: `priced-${r.requestId}`,
            text: `Price set for “${r.title}”. Tap to add to cart`,
            href: '/order-history',
            ts: Date.now(),
          });
        }
      }

      if (notifStatusKey) localStorage.setItem(notifStatusKey, JSON.stringify(nextMap));
      if (newNotifs.length) setNotifications((prevN) => [...newNotifs, ...prevN].slice(0, 10));
    } catch (e) {
      console.debug('Notifications refresh failed', e?.message);
    }
  }, [user, notifStatusKey]);

  React.useEffect(() => {
    if (user && !hasFetchedCart.current) {
      hasFetchedCart.current = true;
      fetchCart();
    }
  }, [user, fetchCart]);

  React.useEffect(() => {
    if (user) {
      loadPdfNotifications();
    } else {
      setNotifications([]);
    }
  }, [user, loadPdfNotifications]);

  const toggleDropdown = () => {
    setDropdownOpen((open) => {
      const next = !open;
      if (!next) {
        setNotifications([]);
      } else {
        loadPdfNotifications();
      }
      return next;
    });
  };

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

  const navLinks = user?.isSupplier 
    ? [{ label: 'Supplier Dashboard', to: '/supplier' }] 
    : [
      { label: 'Home', to: '/' },
      { label: 'Workbook', to: '/workbook' },
      { label: 'About', to: '/about' },
      { label: 'Services', to: '/about#services' },
      { label: 'PDFs/Orders', to: '/order-history' },
      { label: 'Feedback', to: '/feedback' },
      { label: 'Lucky Wheel 🎡', to: '/lucky-wheel' },
    ];

  return (
    <div className="sticky top-0 z-[60] flex flex-col w-full">
      <CodeforaAd variant="top-banner" />
      <nav className="relative green-paper-nav transition-all duration-300">
      <NavbarDecorations />
      <div className="relative z-40 max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded border-2 border-paper/30 overflow-hidden flex items-center justify-center bg-paper/10">
            <img src={logo} alt="KampusKart" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-paper text-xl font-serif font-bold tracking-wide">KampusKart</p>
            <p className="text-[10px] text-paper opacity-70 font-medium tracking-widest mt-0.5">
              Price • Track • Deliver
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => {
            const isHomePage = location.pathname === '/';
            // Determine active status:
            // If on homepage, use scroll spy for Home, About, Services
            // Otherwise, rely on React Router NavLink
            let isCurrent = false;
            if (isHomePage) {
               isCurrent = activeSection === link.label;
            }

            return link.scroll ? (
              <button
                key={link.label}
                onClick={() => handleScrollToFooter(link.scroll)}
                className={`transition py-1 relative group ${isCurrent ? 'text-paper font-bold' : 'text-paper opacity-70 hover:opacity-100'}`}
                style={{ textShadow: isCurrent ? '1px 2px 0px rgba(0,0,0,0.4)' : '1px 1px 0px rgba(0,0,0,0.2)' }}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-paper transition-all ${isCurrent ? 'w-full shadow-[0_2px_0_rgba(0,0,0,0.4)]' : 'w-0 group-hover:w-full group-hover:shadow-[0_2px_0_rgba(0,0,0,0.4)]'}`}></span>
              </button>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={(() => {
                  const isLuckyWheel = link.label === 'Lucky Wheel 🎡';
                  const active = isHomePage && link.label === 'Home' ? isCurrent : location.pathname === link.to;
                  if (isLuckyWheel) {
                    return `transition py-1 relative group text-[#D4AF37] font-black animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] hover:scale-110`;
                  }
                  return `transition py-1 relative group ${active ? 'text-paper font-bold' : 'text-paper opacity-70 hover:opacity-100'}`;
                })()}
                style={{ textShadow: (isHomePage && link.label === 'Home' ? isCurrent : location.pathname === link.to) ? '1px 2px 0px rgba(0,0,0,0.4)' : '1px 1px 0px rgba(0,0,0,0.2)' }}
              >
                <>
                  {link.label}
                  {link.label !== 'Lucky Wheel 🎡' && (
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-paper transition-all ${(isHomePage && link.label === 'Home' ? isCurrent : location.pathname === link.to) ? 'w-full shadow-[0_2px_0_rgba(0,0,0,0.4)]' : 'w-0 group-hover:w-full group-hover:shadow-[0_2px_0_rgba(0,0,0,0.4)]'}`}></span>
                  )}
                </>
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-5 shrink-0">
          {!user?.isSupplier && (
            <div className="relative">
              <Link
                to="/cart"
                className="text-2xl hover:scale-110 transition flex items-center"
                title="Cart"
              >
                <OrigamiCart className="w-8 h-8" />
              </Link>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center bg-paper text-ink text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </div>
          )}

          {user && (
            <div className="relative mr-2 flex items-center gap-2">
              <InboxDropdown />
              
              {/* Tokens Dropdown */}
              <div className="hidden md:block relative group ml-2 z-50">
                <button className="flex items-center gap-1.5 bg-paper/10 hover:bg-paper/20 px-3 py-1.5 rounded-full border border-paper/20 backdrop-blur-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] transition-colors cursor-pointer">
                  <span className="text-[14px]">🎟️</span>
                  <span className="text-xs font-bold text-white">
                    {(user.luckyTokens || 0) + (user.rs9Tokens || 0) + (user.pct20Tokens || 0)}
                  </span>
                </button>
                
                {/* Popover */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 p-3 flex flex-col gap-2">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1 border-b pb-1">Your Tokens</div>
                  
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700 hover:bg-gray-50 p-1 rounded">
                    <span>🎡 Lucky Spins</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{user.luckyTokens || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700 hover:bg-gray-50 p-1 rounded">
                    <span>🎫 ₹9 Books</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">{user.rs9Tokens || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700 hover:bg-gray-50 p-1 rounded">
                    <span>🎟️ 20% OFF</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">{user.pct20Tokens || 0}</span>
                  </div>
                  
                  {!(user.luckyTokens > 0 || user.rs9Tokens > 0 || user.pct20Tokens > 0) && (
                    <div className="text-xs text-gray-500 italic text-center py-2">No tokens available. Spin the wheel to earn some!</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full bg-paper text-ink flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#112e1c] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#112e1c] transition-all overflow-hidden"
            >
              {user ? (
                <img src={avatars[user.avatarIndex || 0]} alt="Profile" className="w-full h-full object-cover" />
              ) : '?'}
            </button>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px]">
                {notifications.length}
              </span>
            )}

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 bg-paper-light border border-ink/10 rounded-lg shadow-xl w-64 z-50 overflow-hidden text-ink">
                {user ? (
                  <>
                    <div className="border-b border-ink/10">
                      <div className="px-4 py-2 text-xs uppercase tracking-wide text-ink/60 font-semibold">Notifications</div>
                      {notifications.length === 0 ? (
                        <div className="px-4 pb-2 text-sm text-ink/80">No new notifications</div>
                      ) : (
                        <div className="max-h-56 overflow-auto">
                          {notifications.map((n) => (
                            <Link
                              key={n.id}
                              to={n.href || '/order-history'}
                              className="block px-4 py-3 text-sm hover:bg-paper"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {n.text}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    {(user.isAdmin || user.isSupplier) && (
                      <Link
                        to="/supplier"
                        className="block px-4 py-3 text-sm hover:bg-paper border-b border-ink/10 font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🏭 Supplier Dashboard
                      </Link>
                    )}
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-sm hover:bg-paper border-b border-ink/10 font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm hover:bg-paper"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {!user.isSupplier && (
                      <>
                        <Link
                          to="/order-history"
                          className="block px-4 py-3 text-sm hover:bg-paper"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Orders and PDF Status
                        </Link>
                        <Link
                          to="/feedback"
                          className="block px-4 py-3 text-sm hover:bg-paper"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Feedback
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium border-t border-ink/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block px-4 py-3 text-sm hover:bg-paper"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 text-sm hover:bg-paper"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            className="md:hidden text-paper ml-2 focus:outline-none flex flex-col items-center justify-center gap-[4px] w-11 h-11 shrink-0 relative z-[60] bg-[#183623] rounded-md border border-[#D4AF37]/30 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:bg-[#132C1B] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`block w-6 h-[4px] bg-[#D4AF37] rounded-full transition-transform duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
            <span className={`block w-6 h-[4px] bg-[#D4AF37] rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[4px] bg-[#D4AF37] rounded-full transition-transform duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#204a2e] border-t border-paper/10 ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col py-2 px-2 space-y-1">
          {navLinks.map((link) => {
            const isHomePage = location.pathname === '/';
            let isCurrent = false;
            if (isHomePage) isCurrent = activeSection === link.label;

            return link.scroll ? (
              <button
                key={link.label}
                onClick={() => {
                  handleScrollToFooter(link.scroll);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left w-full py-3 px-4 rounded-md transition-colors ${isCurrent ? 'bg-paper/10 text-paper font-bold' : 'text-paper/80 hover:text-paper hover:bg-paper/5'}`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-md transition-colors ${
                  (isHomePage && link.label === 'Home' ? isCurrent : location.pathname === link.to) 
                    ? 'bg-paper/10 text-paper font-bold' 
                    : 'text-paper/80 hover:text-paper hover:bg-paper/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
