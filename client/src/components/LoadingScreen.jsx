import React, { useEffect, useState, useRef } from 'react';
import logoAnimation from '../assets/logoanimation.mp4';

const LoadingScreen = ({ duration = 2500, onFinished }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const hasFinished = useRef(false); // Prevent multiple onFinished calls

  useEffect(() => {
    if (hasFinished.current) return; // Already finished, don't run again

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, duration);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (!hasFinished.current && typeof onFinished === 'function') {
        hasFinished.current = true;
        onFinished();
      }
    }, duration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]); // Removed onFinished from deps to prevent re-triggering

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-9999 transition-opacity duration-600 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Loader wrapper: contains rotating ring + static video */}
      <div className="loader-wrapper">
        {/* Rotating green border ring (ONLY this rotates) */}
        <div className="loader-ring"></div>

        {/* Static circular video (does NOT rotate) */}
        <div className="loader-video">
          <video
            src={logoAnimation}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadedMetadata={(e) => {
              e.target.currentTime = 2;
              e.target.playbackRate = 1.5;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
