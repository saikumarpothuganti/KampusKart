import React from 'react';
import { Link } from 'react-router-dom';
import ContactLinks from '../components/ContactLinks';
import NavLink from '../components/NavLink';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import KLlogo from '../assets/KLlogo.png';
import custom from '../assets/custom.png';
import location from '../assets/location.png';

const highlights = [
  'Work delivery on time',
  'Upload custom PDFs — admin will price fairly',
];

const features = [
  {
    title: 'Workbook Printing',
    desc: 'Subject-wise packs with clean layout, sharp print, and fast dispatch.',
    icon: '📚',
    to: '/workbook',
  },
  {
    title: 'Custom PDFs',
    desc: 'Upload your own files; we set the best price and print with care.',
    icon: '🖨️',
    to: '/workbook',
  },
  {
    title: 'Live Tracking',
    desc: 'Stay updated from printing to handoff with map-based tracking.',
    icon: '📍',
    to: '/order-history',
  },
];

const testimonials = [
  {
    quote: 'Got my lab manuals in under a day. Quality and speed both nailed.',
    name: 'Aditi, CSE',
    score: '4.9/5',
  },
  {
    quote: 'Custom PDF upload was smooth; pricing was fair and clear.',
    name: 'Rahul, ECE',
    score: '4.8/5',
  },
];

const Home = () => {
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [userStats, setUserStats] = React.useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    successRate: 0,
    avgDeliveryTime: 0,
    itemsOrdered: 0
  });

  React.useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        const res = await API.get('/orders/my');
        const orders = res.data || [];
        
        const totalOrders = orders.length;
        const activeOrders = orders.filter(o => ['sent', 'placed', 'printing', 'out_for_delivery'].includes(o.status)).length;
        const completedOrders = orders.filter(o => o.status === 'delivered').length;
        const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
        
        const itemsOrdered = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
        
        // Calculate average delivery time for completed orders (mock for now)
        const avgDeliveryTime = completedOrders > 0 ? Math.floor(20 + Math.random() * 15) : 0;
        
        setUserStats({
          totalOrders,
          activeOrders,
          completedOrders,
          successRate,
          avgDeliveryTime,
          itemsOrdered
        });
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };
    
    fetchUserStats();
  }, [user]);

  return (
    <div className="bg-[#0f1116] text-[#e5e7eb] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,#059669_0,transparent_25%),radial-gradient(circle_at_80%_0%,#047857_0,transparent_22%)]" />
        <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 text-xs">
              🚀 Trusted by 5k+ students
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Fast, organized study material with live tracking & smart delivery.
            </h1>
            <p className="text-lg text-[#9ca3af] max-w-xl">
              Pick curated workbooks or upload your own PDFs. We print, track, and deliver right to campus.
            </p>
            <div className="flex flex-wrap gap-3">
              <NavLink
                to="/workbook"
                className="px-5 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#059669] to-[#047857] shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition"
              >
                Browse Materials
              </NavLink>
              <NavLink
                to="/workbook"
                className="px-5 py-3 rounded-full text-sm font-semibold border border-[rgba(255,255,255,0.2)] hover:bg-white/5 text-[#e5e7eb] transition"
              >
                Upload Custom PDF
              </NavLink>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[#9ca3af]">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/5"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#047857]/10 to-[#065f46]/5 blur-3xl" />
            <div className="relative bg-gradient-to-br from-[#047857] to-[#065f46] border border-[#10b981]/30 rounded-[22px] p-6 shadow-[0_0_30px_rgba(6,95,70,0.55),0_0_50px_rgba(4,120,87,0.35),0_20px_40px_rgba(0,0,0,0.3)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">{user ? 'Your Activity' : 'Platform Status'}</p>
                  <h3 className="text-2xl font-semibold text-white">
                    {user ? (userStats.totalOrders > 0 ? '📊 Your Stats' : '🎯 Get Started!') : 'All systems ready ✅'}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-[#10b981]/30 text-white border border-[#10b981]/50">
                  {user ? 'Active' : 'Live'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(user ? [
                  { label: 'Total Orders', value: userStats.totalOrders.toString() },
                  { label: 'Active Orders', value: userStats.activeOrders.toString() },
                  { label: 'Completed', value: userStats.completedOrders.toString() },
                  { label: 'Items Ordered', value: userStats.itemsOrdered.toString() }
                ] : [
                  { label: 'Available Books', value: '150+' },
                  { label: 'Happy Students', value: '5k+' },
                  { label: 'Delivery Rate', value: '98%' },
                  { label: 'Avg Delivery', value: '25m' }
                ]).map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 border border-[#10b981]/30 rounded-[16px] p-3 backdrop-blur-sm"
                  >
                    <p className="text-xs text-white/70">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 border border-[#10b981]/30 rounded-[16px] p-4 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>{user ? 'Order Success Rate' : 'Platform Reliability'}</span>
                  <span className="font-semibold text-white">
                    {user ? `${userStats.successRate}%` : '99.5%'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#10b981] to-[#22c55e] shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    style={{ width: user ? `${userStats.successRate}%` : '99.5%' }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  {user ? (userStats.totalOrders === 0 ? 'Place your first order to track stats' : 'Real-time tracking enabled') : 'Sign in to view your personal stats'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {features.map((f, index) => (
          <NavLink key={f.title} to={f.to} className="group">
            <div
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-gradient-to-br from-[#10b981] via-[#22c55e] to-[#047857] rounded-[18px] p-0 min-h-[420px] flex flex-col shadow-2xl animate-cardPulse transition-transform duration-300 transform ${hoveredCard !== null && hoveredCard !== index ? 'scale-95' : hoveredCard === index ? '-translate-y-3 scale-[1.1]' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1116] overflow-hidden`}
              style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.55), 0 0 50px rgba(34, 197, 94, 0.35), 0 20px 40px rgba(0, 0, 0, 0.3)' }}
            >
              {index === 0 && (
                <img 
                  src={KLlogo} 
                  alt="KL University Logo" 
                  className="w-full h-36 object-cover transition-transform duration-300"
                  style={{ transform: hoveredCard === 0 ? 'scale(1.1)' : 'scale(1)' }}
                />
              )}
              {index === 1 && (
                <img 
                  src={custom} 
                  alt="Custom PDF" 
                  className="w-full h-36 object-cover transition-transform duration-300"
                  style={{ transform: hoveredCard === 1 ? 'scale(1.1)' : 'scale(1)' }}
                />
              )}
              {index === 2 && (
                <img 
                  src={location} 
                  alt="Live Tracking" 
                  className="w-full h-36 object-cover transition-transform duration-300"
                  style={{ transform: hoveredCard === 2 ? 'scale(1.1)' : 'scale(1)' }}
                />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{f.title}</h3>
                <p className="text-white/90 text-base leading-relaxed flex-1">{f.desc}</p>
              </div>
            </div>
          </NavLink>
        ))}
      </section>

      {/* Subjects strip */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 text-sm text-[#9ca3af]">
          {['CSE', 'ECE', 'EEE', 'IT', 'CIVIL', 'MECH', 'MBA', 'MCA'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/5 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-[#111827] border border-[rgba(255,255,255,0.1)] rounded-[18px] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-3 text-lg text-[#e5e7eb]">“{t.quote}”</div>
            <div className="flex items-center justify-between text-sm text-[#9ca3af]">
              <span>{t.name}</span>
              <span className="text-[#14b8a6] font-semibold">{t.score}</span>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="relative overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-r from-[#0f1116] via-[#111827] to-[#0f1116]">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,#059669_0,transparent_25%),radial-gradient(circle_at_80%_0%,#047857_0,transparent_22%)]" />
          <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-[#9ca3af]">Need custom prints?</p>
              <h3 className="text-3xl font-semibold text-[#e5e7eb]">Upload now, we’ll price and deliver fast.</h3>
            </div>
            <NavLink
              to="/workbook"
              className="px-5 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#059669] to-[#047857] shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition"
            >
              Explore Now
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer with About & Services */}
      <footer id="footer" className="bg-gradient-to-br from-[#047857] to-[#065f46]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* About Section */}
            <div id="about">
              <h3 className="text-lg font-bold text-white mb-3">About KampusKart</h3>
              <div className="space-y-2 text-white/90 text-sm leading-relaxed">
                <p>KampusKart is a simple, smart and reliable way for students to get their study materials—printed, organized and delivered with real-time tracking.</p>
                <p>We know how stressful semesters can be. So we built a platform that makes it all effortless.</p>
                <p className="font-semibold text-white">It's your academic convenience partner — helping you stay organized, save time, and focus on learning.</p>
              </div>
            </div>

            {/* Services Section */}
            <div id="services">
              <h3 className="text-lg font-bold text-white mb-3">What We Offer</h3>
              <div className="space-y-2 text-white/90 text-sm">
                <div>
                  <p className="font-semibold text-white">📘 Workbook Printing</p>
                  <p>Professionally printed workbooks with clean formatting.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">📄 Custom PDF Printing</p>
                  <p>Upload any PDF and we'll print and deliver exactly as you want.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">🚚 Live Tracking System</p>
                  <p>Track your order in real time with map-based tracking.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">💵 Transparent Pricing</p>
                  <p>No hidden charges. Clear pricing for all services.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/20 pt-4 text-center">
            <p className="text-white/90 text-sm mb-2">Need Help? Reach us anytime</p>
            <div className="flex justify-center">
              <ContactLinks />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
