import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PartyPopper, Ticket, Gift, Settings2, ShieldCheck, ShoppingBag, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';

const LuckyWheel = () => {
  const { user, setUser } = useAuth();
  const { getActiveCart, getActiveCartTotalPrice } = useCart();
  const cartData = getActiveCart() || { items: [] };
  const cart = cartData.items || [];
  const cartTotal = getActiveCartTotalPrice();
  const navigate = useNavigate();

  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [rs9Left, setRs9Left] = useState(2);
  const [pct20Left, setPct20Left] = useState(2);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    API.get('/settings/wheel_winners_rs9').then(res => setRs9Left(2 - (res.data?.value || 0))).catch(() => {});
    API.get('/settings/wheel_winners_20pct').then(res => setPct20Left(2 - (res.data?.value || 0))).catch(() => {});
    API.get('/wheel/winners').then(res => setWinners(res.data)).catch(() => {});
  }, []);

  const hasToken = user?.luckyTokens > 0;

  const spinWheel = async () => {
    if (spinning) return;
    
    if (!hasToken && !user?.isAdmin) {
      alert('You have no spins left!');
      return;
    }

    setSpinning(true);
    
    // Quick spin while waiting
    const spinInterval = setInterval(() => {
      setRotation(prev => prev + 45);
    }, 50);

    try {
      const res = await API.post('/wheel/spin');
      
      clearInterval(spinInterval);
      
      // Calculate target rotation. 
      // Slices (each 60deg): 0: Try Again, 1: ₹9, 2: Try Again, 3: 20%, 4: Try Again, 5: Extra Spin
      // Pointer is at the TOP (0deg). conic-gradient starts at 0deg.
      // To get slice N (center N*60 + 30) to the top, rotate by 360 - (N*60 + 30).
      
      let sliceIndex = 0; // none
      if (res.data.reward === 'rs9') sliceIndex = 1;
      else if (res.data.reward === '20pct') sliceIndex = 3;
      else if (res.data.reward === 'extraSpin') sliceIndex = 5;
      else {
        // randomly pick between the 'Try Again' slices (0, 2, 4)
        const tryAgainSlices = [0, 2, 4];
        sliceIndex = tryAgainSlices[Math.floor(Math.random() * tryAgainSlices.length)];
      }

      const targetAngle = 360 - (sliceIndex * 60 + 30);
      const spins = 10 * 360; // 10 full spins
      const finalRotation = spins + targetAngle;
      
      setRotation(finalRotation);
      
      setTimeout(() => {
        setReward(res.data.reward);
        setSpinning(false);
        
        if (!user.isAdmin) {
          const updatedUser = { ...user, luckyTokens: user.luckyTokens - 1 };
          if (res.data.reward === 'rs9') updatedUser.rs9Tokens = (updatedUser.rs9Tokens || 0) + 1;
          if (res.data.reward === '20pct') updatedUser.pct20Tokens = (updatedUser.pct20Tokens || 0) + 1;
          if (res.data.reward === 'extraSpin') updatedUser.luckyTokens = (updatedUser.luckyTokens || 0) + 1;
          setUser(updatedUser);
        } else {
          const updatedUser = { ...user };
          if (res.data.reward === 'rs9') updatedUser.rs9Tokens = (updatedUser.rs9Tokens || 0) + 1;
          if (res.data.reward === '20pct') updatedUser.pct20Tokens = (updatedUser.pct20Tokens || 0) + 1;
          if (res.data.reward === 'extraSpin') updatedUser.luckyTokens = (updatedUser.luckyTokens || 0) + 1;
          setUser(updatedUser); 
        }

        // Refresh reward limits and winners
        API.get('/settings/wheel_winners_rs9').then(r => setRs9Left(2 - (r.data?.value || 0))).catch(() => {});
        API.get('/settings/wheel_winners_20pct').then(r => setPct20Left(2 - (r.data?.value || 0))).catch(() => {});
        API.get('/wheel/winners').then(r => setWinners(r.data)).catch(() => {});
      }, 3500); // Wait for transition

    } catch (err) {
      clearInterval(spinInterval);
      setSpinning(false);
      alert(err.response?.data?.error || 'Failed to spin');
    }
  };

  if (!user) {
    return <div className="text-center p-10 font-bold bg-[#0A1A14] min-h-screen text-white">Please login to access the Lucky Wheel.</div>;
  }

  return (
    <div className="min-h-screen bg-[#061510] relative overflow-hidden font-sans">
      
      {/* --- INLINE CSS FOR ADVANCED 3D EFFECTS & ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .festoon-light {
          width: 12px; height: 12px; border-radius: 50%;
          background: #fff; box-shadow: 0 0 10px 3px #FBBF24, 0 0 20px #F59E0B;
          animation: pulse 1.5s infinite alternate;
        }
        .festoon-light:nth-child(even) { animation-delay: 0.5s; box-shadow: 0 0 10px 3px #6EE7B7, 0 0 20px #10B981; }
        .festoon-light:nth-child(3n) { animation-delay: 1s; box-shadow: 0 0 10px 3px #93C5FD, 0 0 20px #3B82F6; }
        @keyframes pulse { 0% { opacity: 0.7; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1.1); } }
        
        .confetti-piece { position: absolute; width: 10px; height: 20px; background: #FFD700; opacity: 0.8; animation: fall linear infinite; top: -20px; z-index: 1; }
        @keyframes fall {
          to { transform: translateY(100vh) rotate(360deg); }
        }
        
        .glass-panel {
          background: rgba(16, 42, 30, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(110, 231, 183, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .wheel-shadow {
          box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,215,0,0.4);
        }
        
        .gold-rim {
          background: linear-gradient(135deg, #FFD700, #FDB931 20%, #9F7928 50%, #FDB931 80%, #FFD700);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(255,215,0,0.3);
        }

        .center-btn {
          background: linear-gradient(135deg, #2D3748, #1A202C);
          box-shadow: 0 10px 20px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.2), 0 0 0 6px #FFD700;
        }
        
        .marquee {
          overflow: hidden; white-space: nowrap; box-sizing: border-box; height: 160px; position: relative;
        }
        .marquee-content {
          animation: marquee 15s linear infinite; display: flex; flex-direction: column; gap: 12px;
        }
        @keyframes marquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        .3d-card {
          background: #F9F6F0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.5);
          position: relative;
        }
        .3d-card::before {
          content: ""; position: absolute; inset: -4px; background: linear-gradient(135deg, rgba(0,0,0,0.1), transparent);
          z-index: -1; transform: translate(4px, 4px); filter: blur(4px);
        }
      `}} />

      {/* Confetti Generation */}
      {[...Array(30)].map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 3 + 3}s`,
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: ['#FFD700', '#6EE7B7', '#F87171', '#60A5FA'][Math.floor(Math.random() * 4)]
        }} />
      ))}

      {/* Festoon Lights String */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-[5%] py-4 z-0 pointer-events-none opacity-80">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="festoon-light mt-[-10px]" style={{ transform: `translateY(${Math.sin(i * 0.5) * 20}px)` }} />
        ))}
        {/* Fake wire curve */}
        <svg className="absolute top-2 left-0 w-full h-12" preserveAspectRatio="none">
           <path d="M0,0 Q500,60 1000,0" fill="none" stroke="#222" strokeWidth="2" opacity="0.3"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto pt-16 pb-10 px-4 sm:px-6 relative z-10 flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center mb-10 relative">
          <div className="inline-block bg-emerald-600 text-white font-bold px-4 py-1 rounded-sm uppercase tracking-widest text-sm mb-2 shadow-lg transform -skew-x-12">
             Phase 2 Event
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D1FAE5] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] filter drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] leading-none uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
            LUCKY<br/>WHEEL
          </h1>
          <div className="relative mt-2">
            <svg width="300" height="40" viewBox="0 0 300 40" className="mx-auto drop-shadow-md">
              <path d="M0 20 L20 0 H280 L300 20 L280 40 H20 Z" fill="#FDE68A" />
              <text x="150" y="26" textAnchor="middle" fill="#78350F" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Spin. Win. Save.</text>
            </svg>
          </div>
        </div>

        {/* Desktop 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-center mb-16">
          
          {/* Left Column Panels */}
          <div className="hidden lg:flex flex-col gap-6 items-end relative">
            <div className="3d-card p-4 rounded text-center transform -rotate-2 w-48 shadow-xl relative text-[#3F2A1D]">
               <Gift className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
               <p className="font-bold text-sm">Spin the wheel to win exciting prizes!</p>
               {/* 3D Fold effect */}
               <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-transparent via-[#E5E0D8] to-[#D5D0C8] shadow-[-2px_2px_2px_rgba(0,0,0,0.1)]"></div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl w-64 shadow-2xl relative border-l-4 border-emerald-500">
               <div className="flex gap-4 items-center mb-2">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded flex items-center justify-center border border-emerald-500/50">
                    <ShoppingBag className="text-emerald-400" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold">Need Spins?</h3>
                   <p className="text-emerald-200 text-xs">Place an order & ask Admin</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Center Column: The Wheel */}
          <div className="flex justify-center relative">
            
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full scale-150 z-0 pointer-events-none"></div>

            {/* The Wheel Container */}
            <div className={`relative z-10 p-4 rounded-full gold-rim wheel-shadow transition-opacity duration-500 ${hasToken || user?.isAdmin ? 'opacity-100' : 'opacity-70 grayscale-[0.3]'}`}>
              
              {/* Gold pointer */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
                 <svg width="40" height="50" viewBox="0 0 40 50">
                    <path d="M20 50L0 0H40L20 50Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="40" y2="50">
                        <stop offset="0%" stopColor="#FEF3C7" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>
              {/* High-Fidelity SVG Wheel */}
              <div 
                className="w-80 h-80 sm:w-[450px] sm:h-[450px] relative transition-transform ease-out duration-[3500ms]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl overflow-visible">
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="20%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#78350F" />
                      <stop offset="80%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#FDE047" />
                    </linearGradient>
                    <linearGradient id="sliceGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="sliceWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E5E7EB" />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.5" />
                    </filter>
                    <filter id="innerGlow">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                      <feFlood floodColor="#000" floodOpacity="0.5" />
                      <feComposite operator="in" in2="blur" />
                      <feComposite operator="arithmetic" k2="-1" k3="1" in2="SourceAlpha" result="inv" />
                    </filter>
                  </defs>

                  {/* Outer Rim */}
                  <circle cx="200" cy="200" r="198" fill="url(#goldGrad)" filter="url(#shadow)" />
                  <circle cx="200" cy="200" r="185" fill="#022C22" />

                  {/* Wedges Group (Rotated so 0deg is Top) */}
                  <g transform="rotate(-90 200 200)">
                    {[
                      { text: "TRY AGAIN", color: "url(#sliceWhite)", textColor: "#6B7280" },
                      { text: "₹9 BOOK", color: "url(#sliceGreen)", textColor: "#FFFFFF" },
                      { text: "TRY AGAIN", color: "url(#sliceWhite)", textColor: "#6B7280" },
                      { text: "20% OFF", color: "url(#sliceGreen)", textColor: "#FFFFFF" },
                      { text: "TRY AGAIN", color: "url(#sliceWhite)", textColor: "#6B7280" },
                      { text: "EXTRA SPIN", color: "url(#sliceGreen)", textColor: "#FFFFFF" }
                    ].map((slice, i) => {
                      const startAngle = i * 60;
                      const endAngle = (i + 1) * 60;
                      const cx = 200; const cy = 200; const r = 180;
                      
                      const startX = cx + r * Math.cos(Math.PI * startAngle / 180);
                      const startY = cy + r * Math.sin(Math.PI * startAngle / 180);
                      const endX = cx + r * Math.cos(Math.PI * endAngle / 180);
                      const endY = cy + r * Math.sin(Math.PI * endAngle / 180);
                      
                      const pathData = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY} Z`;
                      
                      // Text positioning (center of the wedge)
                      const midAngle = startAngle + 30;
                      const textRadius = 110;
                      const textX = cx + textRadius * Math.cos(Math.PI * midAngle / 180);
                      const textY = cy + textRadius * Math.sin(Math.PI * midAngle / 180);
                      
                      return (
                        <g key={i}>
                          <path d={pathData} fill={slice.color} stroke="#064E3B" strokeWidth="2" />
                          
                          {/* Inner Shadow per slice for 3D effect */}
                          <path d={pathData} fill="transparent" stroke="#000" strokeWidth="4" opacity="0.1" />

                          <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                            {/* Adding a simple diamond icon above text */}
                            <path d="M 0 -25 L 8 -17 L 0 -9 L -8 -17 Z" fill={slice.textColor} opacity="0.6" />
                            <text 
                              x="0" y="5" 
                              textAnchor="middle" 
                              fill={slice.textColor} 
                              fontSize="18" 
                              fontWeight="900" 
                              fontFamily="sans-serif"
                              style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))" }}
                            >
                              {slice.text}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>

                  {/* Rim Bulbs */}
                  {[...Array(24)].map((_, i) => {
                    const angle = i * 15;
                    const cx = 200 + 191 * Math.cos(Math.PI * angle / 180);
                    const cy = 200 + 191 * Math.sin(Math.PI * angle / 180);
                    const isEven = i % 2 === 0;
                    return (
                      <circle 
                        key={i} 
                        cx={cx} cy={cy} r="3.5" 
                        fill={isEven ? "#FEF08A" : "#FFFFFF"} 
                        className={isEven ? "animate-pulse" : ""}
                        style={{ filter: isEven ? "drop-shadow(0 0 4px #FBBF24)" : "drop-shadow(0 0 2px #FFF)" }}
                      />
                    );
                  })}
                  
                  {/* Inner Golden Ring */}
                  <circle cx="200" cy="200" r="180" fill="transparent" stroke="url(#goldGrad)" strokeWidth="6" opacity="0.8" />
                </svg>
              </div>

              {/* Center "SPIN & WIN" Button */}
              <button 
                onClick={spinWheel}
                disabled={spinning || reward || (!hasToken && !user?.isAdmin)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full center-btn z-30 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform disabled:opacity-80 group border-4 border-[#FDE047]"
              >
                <span className="text-[#FDE047] font-black text-2xl sm:text-3xl tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">SPIN</span>
                <span className="text-[#6EE7B7] font-bold text-sm sm:text-base tracking-widest">& WIN</span>
              </button>
            </div>
            
            {/* Base Platform */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-12 bg-black/40 rounded-[100%] blur-sm z-0"></div>
          </div>

          {/* Right Column Panels */}
          <div className="w-full lg:w-auto flex flex-col gap-6 items-center lg:items-start relative z-20">
            
            {/* You Have X Spin Box */}
            <div className="glass-panel p-4 rounded-xl text-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border-2 border-[#10B981] relative overflow-hidden w-full lg:w-56">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
               <p className="text-emerald-400 font-bold tracking-widest text-sm relative z-10">YOU HAVE</p>
               <h2 className="text-4xl font-black text-white relative z-10 mb-2 drop-shadow-lg">{user.luckyTokens} SPIN{user.luckyTokens !== 1 ? 'S' : ''}</h2>
               {(!hasToken && !user?.isAdmin) && (
                 <div className="relative z-10 bg-black/30 p-2 rounded text-xs text-gray-300 mt-2">
                    <span className="text-red-400 font-bold block mb-1">
                      No spins left!
                    </span>
                    <span className="text-[10px] text-gray-300 block leading-tight mb-2 opacity-90">
                      Place an order to get free Lucky Wheel Tokens!
                    </span>
                    <button onClick={() => navigate('/cart')} className="w-full mt-1 bg-emerald-600 text-white rounded py-1.5 font-bold hover:bg-emerald-500 transition shadow">
                      Go to Cart
                    </button>
                 </div>
               )}
            </div>

            {/* Live Winners Marquee - Only show if there are actual non-admin winners */}
            {winners.length > 0 && (
              <div className="glass-panel p-4 rounded-xl w-full lg:w-64 border border-yellow-500/30">
                 <h3 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2 border-b border-yellow-500/20 pb-2">
                   LIVE WINNERS <span>🔥</span>
                 </h3>
                 <div className="marquee">
                   <div className="marquee-content">
                      {/* Render real winners twice for seamless loop */}
                      {[1,2].map(loop => (
                        <React.Fragment key={loop}>
                          {winners.map((winner, idx) => (
                            <div key={idx} className="flex gap-3 items-center bg-black/20 p-2 rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold uppercase">
                                {winner.name.substring(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{winner.name.split(' ')[0]}</p>
                                <p className="text-xs text-emerald-400 truncate">Won {winner.reward}</p>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                   </div>
                 </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Bottom Section: Possible Rewards */}
        <div className="w-full max-w-5xl relative z-20 mt-10">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1A2E20] border-y border-emerald-500/30 px-8 py-2 font-bold text-emerald-400 flex items-center gap-2 shadow-lg">
              ✨ POSSIBLE REWARDS ✨
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4">
             {/* Reward Card 1 */}
             <div className="3d-card rounded p-4 text-center text-[#3F2A1D] transform transition hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-inner border border-emerald-200">
                  <BookOpen className="text-emerald-600 w-8 h-8" />
                </div>
                <h4 className="font-black text-lg">₹9 BOOK</h4>
                <div className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black tracking-widest mt-1 mb-1 border border-red-200">{Math.max(0, rs9Left)}/2 LEFT</div>
                <p className="text-xs text-gray-600 mt-1">Get your cart's cheapest book for just ₹9!</p>
             </div>
             
             {/* Reward Card 2 */}
             <div className="3d-card rounded p-4 text-center text-[#3F2A1D] transform transition hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3 shadow-inner border border-orange-200">
                  <Ticket className="text-orange-600 w-8 h-8" />
                </div>
                <h4 className="font-black text-lg">20% OFF</h4>
                <div className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black tracking-widest mt-1 mb-1 border border-red-200">{Math.max(0, pct20Left)}/2 LEFT</div>
                <p className="text-xs text-gray-600 mt-1">Flat 20% discount on your entire order.</p>
             </div>
             
             {/* Reward Card 3 */}
             <div className="3d-card rounded p-4 text-center text-[#3F2A1D] transform transition hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 shadow-inner border border-purple-200">
                  <Sparkles className="text-purple-600 w-8 h-8" />
                </div>
                <h4 className="font-black text-lg">EXTRA SPIN</h4>
                <p className="text-xs text-gray-600 mt-1">Try your luck again immediately!</p>
             </div>
             
             {/* Reward Card 4 */}
             <div className="3d-card rounded p-4 text-center text-[#3F2A1D] transform transition hover:-translate-y-1 opacity-70">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 shadow-inner border border-gray-300">
                  <HelpCircle className="text-gray-500 w-8 h-8" />
                </div>
                <h4 className="font-black text-lg">TRY AGAIN</h4>
                <p className="text-xs text-gray-500 mt-1">Better luck next time.</p>
             </div>
          </div>
        </div>
        
        {/* Footer Guarantees */}
        <div className="w-full max-w-5xl mt-16 glass-panel rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-300">
           <div className="flex gap-3 items-start">
             <ShieldCheck className="text-emerald-400 flex-shrink-0" />
             <div><p className="font-bold text-white">100% Genuine</p><p className="text-xs">Every spin is fair and transparent.</p></div>
           </div>
           <div className="flex gap-3 items-start">
             <ShoppingBag className="text-emerald-400 flex-shrink-0" />
             <div><p className="font-bold text-white">More Orders</p><p className="text-xs">More orders mean more chances to win.</p></div>
           </div>
           <div className="flex gap-3 items-start">
             <Gift className="text-emerald-400 flex-shrink-0" />
             <div><p className="font-bold text-white">Exciting Rewards</p><p className="text-xs">Discounts, upgrades, coupons and more.</p></div>
           </div>
           <div className="flex gap-3 items-start">
             <Settings2 className="text-emerald-400 flex-shrink-0" />
             <div><p className="font-bold text-white">Made for Students</p><p className="text-xs">Every reward is designed keeping students in mind.</p></div>
           </div>
        </div>

      </div>

      {/* Reward Popup */}
      {reward && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#102A1E] p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce-short border border-emerald-500">
            <h2 className="text-3xl font-black mb-4 text-white flex items-center justify-center gap-2">
              {reward === 'none' ? 'AWW SHUCKS! 😢' : <><PartyPopper className="text-yellow-400 w-8 h-8"/> JACKPOT! <PartyPopper className="text-yellow-400 w-8 h-8"/></>}
            </h2>
            <div className="text-lg font-serif font-bold text-emerald-100 mb-6 bg-emerald-900/50 py-4 rounded-lg border border-emerald-700/50">
              {reward === 'rs9' && "You've earned a ₹9 Book Token! Apply it at checkout."}
              {reward === '20pct' && "You've earned a 20% OFF Token! Apply it at checkout."}
              {reward === 'extraSpin' && "You've won an EXTRA SPIN! Go ahead and spin again!"}
              {reward === 'none' && "No tokens this time, but thanks for playing!"}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setReward(null)}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded shadow hover:bg-emerald-500 transition"
              >
                Close
              </button>
              {(reward === 'rs9' || reward === '20pct') && (
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full py-3 bg-transparent text-emerald-400 font-bold rounded border border-emerald-500 hover:bg-emerald-900/30 transition"
                >
                  Use Token in Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;
