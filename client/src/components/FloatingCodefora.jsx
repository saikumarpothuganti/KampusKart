import React, { useState } from 'react';
import { X } from 'lucide-react';
import logoImg from '../assets/logointo_codefora.jpeg';
import { useAuth } from '../context/AuthContext';

const FloatingCodefora = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Hide for suppliers just like the other ads
  if (user?.isSupplier) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-[#050505] border border-[#333] rounded-xl shadow-[0_0_30px_rgba(255,102,0,0.2)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative h-32 w-full">
            <img src={logoImg} alt="Codefora" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 bg-black/50 text-gray-300 hover:text-white rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-5 flex flex-col items-center text-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/10 rounded-full blur-[40px] pointer-events-none"></div>
            
            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-wide relative z-10">
              Level Up Your Coding
            </h4>
            <p className="text-gray-400 text-sm mb-4 relative z-10">
              Join <span className="text-[#FF6600] font-bold">CODEFORA</span> to practice DSA, build frontend projects, and collaborate in real-time with your peers.
            </p>
            <a 
              href="https://codefora.online" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#FF6600] text-black font-black uppercase tracking-wider text-sm rounded transition-all hover:bg-[#00E5FF] shadow-[0_0_15px_rgba(255,102,0,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] text-center relative z-10"
            >
              Collaborate Now
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#050505] border-2 border-[#FF6600] text-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.5)] transition-all hover:scale-110 hover:shadow-[0_0_25px_rgba(255,102,0,0.8)] focus:outline-none ${isOpen ? 'rotate-90 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'}`}
      >
        <span className="font-black text-xl">{`{ }`}</span>
      </button>

      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FF6600] text-black shadow-[0_0_15px_rgba(255,102,0,0.5)] transition-all hover:scale-110 focus:outline-none rotate-0 absolute bottom-0 left-0"
        >
          <X size={24} className="font-bold" />
        </button>
      )}
    </div>
  );
};

export default FloatingCodefora;
