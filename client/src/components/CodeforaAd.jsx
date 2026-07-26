import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import billboardImg from '../assets/billboard_codefora.jpeg';
import logoImg from '../assets/logointo_codefora.jpeg';

const CodeforaAd = ({ variant }) => {
  const { user } = useAuth();
  const [showTopBanner, setShowTopBanner] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('hideCodeforaBanner')) {
      setShowTopBanner(false);
    }
  }, []);

  if (user?.isSupplier) return null;

  const handleDismiss = () => {
    localStorage.setItem('hideCodeforaBanner', 'true');
    setShowTopBanner(false);
  };

  const codeforaUrl = 'https://codefora.online';

  if (variant === 'top-banner') {
    if (!showTopBanner) return null;
    return (
      <div className="bg-black text-white py-3 px-4 flex justify-between items-center relative overflow-hidden group border-b border-[#FF6600]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 to-[#FF6600]/10 opacity-50"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10 w-full">
          <span className="text-xl hidden sm:inline text-[#FF6600] font-black">{`{/}`}</span>
          <p className="text-sm md:text-base font-medium text-center tracking-wide">
            COMMUNICATE. COLLABORATE. CODE TOGETHER. Join <span className="font-black text-[#FF6600] tracking-widest uppercase">Codefora</span>
          </p>
          <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="bg-[#FF6600] hover:bg-[#00E5FF] hover:text-[#050505] text-[#050505] px-5 py-1.5 rounded-sm text-sm font-black transition-all shadow-[0_0_10px_rgba(255,102,0,0.5)] hover:shadow-[0_0_15px_rgba(0,229,255,0.8)] ml-2 whitespace-nowrap uppercase tracking-wider">
            Play Now
          </a>
        </div>
        <button onClick={handleDismiss} className="absolute right-4 text-gray-500 hover:text-[#FF6600] z-10 p-2 transition-colors">
          ✕
        </button>
      </div>
    );
  }

  if (variant === 'billboard') {
    return (
      <div className="w-full max-w-6xl mx-auto my-16 px-4">
        <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,102,0,0.15)] group hover:shadow-[0_0_50px_rgba(255,102,0,0.3)] transition-all duration-500 border border-[#222]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
          <img src={billboardImg} alt="Codefora Real-Time Coding Platform" className="w-full h-[350px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="text-white max-w-2xl">
              <span className="text-[#00E5FF] font-black text-sm uppercase tracking-[0.3em] mb-4 inline-block flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span> Live Room
              </span>
              <h3 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg leading-none tracking-tight uppercase">
                Build Smarter.<br/><span className="text-[#FF6600]">Together.</span>
              </h3>
              <p className="text-gray-400 text-base md:text-xl max-w-lg font-light tracking-wide">
                Practice coding the way real software teams work with <span className="text-white font-bold tracking-widest">{`{ }`} CODEFORA</span>.
              </p>
            </div>
            <button className="bg-[#FF6600] hover:bg-[#00E5FF] text-[#050505] px-10 py-4 rounded-sm font-black text-lg transition-all shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] whitespace-nowrap uppercase tracking-widest">
              Start Building
            </button>
          </div>
        </a>
      </div>
    );
  }

  if (variant === 'success-upsell') {
    return (
      <div className="mt-12 bg-[#050505] border border-[#333] rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden group max-w-4xl mx-auto hover:border-[#FF6600]/50 transition-colors duration-500">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6600]/10 rounded-full blur-[80px] group-hover:bg-[#FF6600]/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00E5FF]/10 rounded-full blur-[80px] group-hover:bg-[#00E5FF]/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-[#FF6600] font-black text-4xl mb-4 drop-shadow-[0_0_15px_rgba(255,102,0,0.8)]">{`{/}`}</span>
          <h4 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Express Your <span className="text-[#00E5FF]">Coding Mood.</span></h4>
          <p className="text-gray-400 mb-8 max-w-xl text-lg font-light tracking-wide">
            Ready for your next challenge? Join <span className="text-white font-bold tracking-widest">CODEFORA</span>, the ultimate real-time collaborative coding platform.
          </p>
          <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-[#FF6600] hover:bg-[#FF6600] text-[#FF6600] hover:text-[#050505] px-12 py-4 rounded-sm font-black text-lg transition-all shadow-[0_0_15px_rgba(255,102,0,0.2)] hover:shadow-[0_0_25px_rgba(255,102,0,0.5)] uppercase tracking-widest">
            Join Codefora Free
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'feedback-popup') {
    const [showPopup, setShowPopup] = useState(true);
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
        <div className="bg-[#050505] border border-[#333] rounded-xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,102,0,0.2)] relative overflow-hidden group">
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white z-20 transition-colors bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6600]/10 rounded-full blur-[60px] group-hover:bg-[#FF6600]/20 transition-all duration-700"></div>
          
          <img src={logoImg} alt="Codefora Logo" className="w-32 h-32 object-contain mx-auto mb-6 rounded-lg shadow-lg relative z-10 border border-[#333]" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h4 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight leading-tight">
              Time to code while you receive your order!
            </h4>
            <p className="text-gray-400 mb-6 text-sm md:text-base font-light tracking-wide">
              Jump into <span className="text-[#FF6600] font-bold tracking-widest uppercase">Codefora</span> and start collaborating instantly.
            </p>
            <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" onClick={() => setShowPopup(false)} className="w-full bg-[#FF6600] hover:bg-[#00E5FF] text-[#050505] px-8 py-3 rounded-sm font-black text-lg transition-all shadow-[0_0_15px_rgba(255,102,0,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] uppercase tracking-widest text-center">
              Enter Codefora
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CodeforaAd;
