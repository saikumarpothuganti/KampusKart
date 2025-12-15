import React from 'react';

const Background = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(20,184,166,0.35), rgba(20,184,166,0.08) 60%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -top-16 -right-16 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,158,11,0.35), rgba(245,158,11,0.08) 60%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(99,102,241,0.28), rgba(99,102,241,0.06) 60%, transparent 70%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.25]" />
    </div>
  );
};

export default Background;
