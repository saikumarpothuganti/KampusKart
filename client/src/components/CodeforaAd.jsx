import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
      <div className="bg-[#07111F] text-white py-3 px-4 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/20 to-[#FF8A00]/20 opacity-50"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10 w-full">
          <span className="text-xl hidden sm:inline">🚀</span>
          <p className="text-sm md:text-base font-medium text-center">
            Take your coding skills to the next level. Join <span className="font-black text-[#FF8A00] tracking-wide">CODEFORA</span>, the real-time collaborative coding platform!
          </p>
          <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="bg-[#3B82F6] hover:bg-[#FF8A00] text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(255,138,0,0.8)] ml-2 whitespace-nowrap">
            Play Now
          </a>
        </div>
        <button onClick={handleDismiss} className="absolute right-4 text-gray-400 hover:text-white z-10 p-2">
          ✕
        </button>
      </div>
    );
  }

  if (variant === 'billboard') {
    return (
      <div className="w-full max-w-6xl mx-auto my-16 px-4">
        <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.2)] group hover:shadow-[0_0_50px_rgba(255,138,0,0.3)] transition-all duration-500 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/60 to-transparent z-10"></div>
          <img src="/codefora_ad.jpg" alt="Codefora Real-Time Coding Platform" className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="text-white max-w-2xl">
              <span className="bg-[#FF8A00] text-[#07111F] font-black text-xs uppercase tracking-widest px-3 py-1 rounded-sm mb-4 inline-block shadow-[0_0_15px_rgba(255,138,0,0.5)]">Sponsored</span>
              <h3 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-lg leading-tight">Code Together.<br/><span className="text-[#3B82F6]">Compete Together.</span></h3>
              <p className="text-gray-300 text-base md:text-lg">Practice coding the way real software teams work with <span className="text-[#FF8A00] font-bold">Codefora</span>.</p>
            </div>
            <button className="bg-[#FF8A00] hover:bg-white hover:text-[#07111F] text-[#07111F] px-8 py-3 rounded-full font-black text-lg transition-colors shadow-[0_0_20px_rgba(255,138,0,0.6)] whitespace-nowrap">
              Explore Codefora
            </button>
          </div>
        </a>
      </div>
    );
  }

  if (variant === 'success-upsell') {
    return (
      <div className="mt-12 bg-[#0D1117] border border-[#3B82F6]/30 rounded-xl p-8 shadow-2xl relative overflow-hidden group max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A00]/10 rounded-full blur-3xl group-hover:bg-[#FF8A00]/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl group-hover:bg-[#3B82F6]/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="bg-[#3B82F6]/20 text-[#3B82F6] font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-[#3B82F6]/30">Level Up</span>
          <h4 className="text-3xl font-black text-white mb-3">Master DSA & Frontend</h4>
          <p className="text-gray-400 mb-8 max-w-lg text-lg">
            Ready for your next challenge? Join <span className="text-[#FF8A00] font-bold">Codefora</span>, the ultimate real-time collaborative coding platform.
          </p>
          <a href={codeforaUrl} target="_blank" rel="noopener noreferrer" className="bg-[#3B82F6] hover:bg-[#FF8A00] text-white px-10 py-4 rounded-lg font-black text-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(255,138,0,0.6)] transform hover:-translate-y-1">
            Join Codefora Free
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default CodeforaAd;
