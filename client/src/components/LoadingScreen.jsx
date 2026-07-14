import React, { useEffect, useState } from 'react';
import logoAnimation from '../assets/kampuskart_loader.mp4';

const LoadingScreen = ({ duration = 2000, onFinished }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onFinished === 'function') {
        onFinished();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinished]);

  if (!visible) return null;

  // Generate 40 paper particles that emit exactly from the rotating branch
  const SPINNER_DURATION = 1.2;
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const delay = (i / 40) * SPINNER_DURATION;
    
    // The spinner completes 360 degrees every SPINNER_DURATION.
    // CSS borders rotate starting from the top (-90 degrees in standard math).
    const spinnerAngle = (delay / SPINNER_DURATION) * 360;
    const angle = spinnerAngle - 90 + (Math.random() * 20 - 10);
    const rad = (angle * Math.PI) / 180;
    
    // Start exactly at the edge of the circle (approx 66px radius for the md:w-40 circle)
    const startRadius = 66;
    const startX = Math.cos(rad) * startRadius;
    const startY = Math.sin(rad) * startRadius;
    
    // Fly outward randomly
    const flyDist = 40 + Math.random() * 70;
    const endX = Math.cos(rad) * (startRadius + flyDist);
    const endY = Math.sin(rad) * (startRadius + flyDist);
    
    const rot = Math.random() * 360 + 180;
    const colors = ['#FDFCF9', '#D5E2D1', '#8FAD8C', '#599A69'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 8;
    return { startX, startY, endX, endY, rot, delay, color, size };
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Outer wrapper - Exact size of video so the ring sits ON the border */}
      <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
        
        {/* Branch-like Rotating Buffer - Green, exactly on circumference */}
        <div 
          className="absolute inset-[-4px] rounded-full border-[6px] border-transparent border-t-[#388E3C] border-r-[#599A69] animate-[spin_1.2s_linear_infinite] z-20 pointer-events-none" 
          style={{ filter: 'drop-shadow(0 0 12px rgba(56,142,60,0.9))' }}
        ></div>

        {/* Particles flying outward synced with the branch */}
        {particles.map((p, i) => (
          <div 
            key={i}
            className="absolute left-1/2 top-1/2 animate-paper-emit pointer-events-none z-0"
            style={{
              '--startX': `${p.startX}px`,
              '--startY': `${p.startY}px`,
              '--endX': `${p.endX}px`,
              '--endY': `${p.endY}px`,
              '--rot': `${p.rot}deg`,
              animationDelay: `${p.delay}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              clipPath: i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              marginLeft: `-${p.size/2}px`,
              marginTop: `-${p.size/2}px`
            }}
          />
        ))}

        {/* Core Video Container (Sits on top) */}
        <div className="w-full h-full rounded-full overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center justify-center bg-white relative z-10">
          <video 
            src={logoAnimation} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-[130%] h-[130%] object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[45%]" 
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
