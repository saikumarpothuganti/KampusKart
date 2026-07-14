import React from 'react';

// Green Palette for the clean folded paper look
const C_FACE = "#388E3C"; // Bright green paper
const C_BACK = "#2E7D32"; // Dark shaded folded green
const C_DARK = "#1B5E20";
const C_SHADOW = "rgba(0,0,0,0.4)";

const LetterK = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,30 30,30 60,0 46,0" fill={C_BACK} />
    <polygon points="0,32 16,32 60,80 44,80" fill={C_FACE} />
    <polygon points="16,32 30,32 16,46" fill={C_SHADOW} />
    <polygon points="0,32 16,32 16,48 0,48" fill={C_SHADOW} opacity="0.3" />
  </svg>
);

const LetterA = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="22,0 38,0 60,80 44,80" fill={C_BACK} />
    <polygon points="22,0 38,0 16,80 0,80" fill={C_FACE} />
    <polygon points="10,50 50,50 54,34 6,34" fill={C_FACE} />
    <polygon points="22,0 38,0 30,29" fill={C_SHADOW} opacity="0.4" />
    <polygon points="10,50 6,34 22,34" fill={C_SHADOW} opacity="0.5" />
    <polygon points="50,50 54,34 38,34" fill={C_SHADOW} opacity="0.5" />
  </svg>
);

const LetterM = () => (
  <svg viewBox="-10 -10 100 100" className="w-[1.5em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="64,0 80,0 80,80 64,80" fill={C_FACE} />
    <polygon points="64,0 80,0 40,60 24,60" fill={C_BACK} />
    <polygon points="0,0 16,0 56,60 40,60" fill={C_FACE} />
    <polygon points="0,0 16,0 16,24" fill={C_SHADOW} opacity="0.4" />
    <polygon points="64,0 80,0 64,24" fill={C_SHADOW} opacity="0.4" />
    <polygon points="40,60 56,60 40,36" fill={C_SHADOW} opacity="0.5" />
  </svg>
);

const LetterP = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 60,0 60,16 16,16" fill={C_FACE} />
    <polygon points="44,16 60,16 60,48 44,48" fill={C_BACK} />
    <polygon points="16,32 60,32 60,48 16,48" fill={C_FACE} />
    <polygon points="16,0 16,16 32,16" fill={C_SHADOW} opacity="0.2" />
    <polygon points="44,16 60,16 44,32" fill={C_SHADOW} opacity="0.4" />
    <polygon points="44,48 60,48 60,32" fill={C_SHADOW} opacity="0.4" />
    <polygon points="16,32 16,48 32,32" fill={C_SHADOW} opacity="0.2" />
  </svg>
);

const LetterU = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,64 0,64" fill={C_FACE} />
    <polygon points="44,0 60,0 60,64 44,64" fill={C_BACK} />
    <polygon points="0,64 60,64 60,80 0,80" fill={C_FACE} />
    <polygon points="0,64 16,64 16,80" fill={C_SHADOW} opacity="0.3" />
    <polygon points="44,64 60,64 44,80" fill={C_SHADOW} opacity="0.5" />
  </svg>
);

const LetterS = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 60,0 60,16 0,16" fill={C_FACE} />
    <polygon points="0,16 16,16 16,48 0,48" fill={C_BACK} />
    <polygon points="0,32 60,32 60,48 0,48" fill={C_FACE} />
    <polygon points="44,48 60,48 60,80 44,80" fill={C_BACK} />
    <polygon points="0,64 60,64 60,80 0,80" fill={C_FACE} />
    <polygon points="0,16 16,16 16,32" fill={C_SHADOW} opacity="0.5" />
    <polygon points="0,32 16,32 0,48" fill={C_SHADOW} opacity="0.3" />
    <polygon points="44,48 60,48 44,64" fill={C_SHADOW} opacity="0.5" />
    <polygon points="44,64 60,64 60,80" fill={C_SHADOW} opacity="0.3" />
  </svg>
);

const LetterR = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 60,0 60,16 16,16" fill={C_FACE} />
    <polygon points="44,16 60,16 60,48 44,48" fill={C_BACK} />
    <polygon points="16,32 60,32 60,48 16,48" fill={C_FACE} />
    <polygon points="28,48 44,48 60,80 44,80" fill={C_BACK} />
    <polygon points="16,0 16,16 32,16" fill={C_SHADOW} opacity="0.2" />
    <polygon points="44,16 60,16 44,32" fill={C_SHADOW} opacity="0.4" />
    <polygon points="44,48 60,48 60,32" fill={C_SHADOW} opacity="0.4" />
    <polygon points="16,32 16,48 32,32" fill={C_SHADOW} opacity="0.2" />
    <polygon points="28,48 44,48 44,64" fill={C_SHADOW} opacity="0.5" />
  </svg>
);

const LetterT = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 60,0 60,16 0,16" fill={C_FACE} />
    <polygon points="22,16 38,16 38,80 22,80" fill={C_BACK} />
    <polygon points="22,16 38,16 30,24" fill={C_SHADOW} opacity="0.5" />
  </svg>
);

const LetterW = () => (
  <svg viewBox="-10 -10 100 100" className="w-[1.5em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="64,0 80,0 80,80 64,80" fill={C_FACE} />
    <polygon points="16,64 32,64 48,32 32,32" fill={C_BACK} />
    <polygon points="32,32 48,32 64,64 48,64" fill={C_FACE} />
  </svg>
);

const LetterE = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 60,0 60,16 16,16" fill={C_BACK} />
    <polygon points="16,32 45,32 45,48 16,48" fill={C_FACE} />
    <polygon points="16,64 60,64 60,80 16,80" fill={C_BACK} />
  </svg>
);

const LetterL = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,64 60,64 60,80 16,80" fill={C_BACK} />
  </svg>
);

const LetterC = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 60,0 60,16 16,16" fill={C_BACK} />
    <polygon points="16,64 60,64 60,80 16,80" fill={C_FACE} />
  </svg>
);

const LetterO = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="44,0 60,0 60,80 44,80" fill={C_FACE} />
    <polygon points="16,0 44,0 44,16 16,16" fill={C_BACK} />
    <polygon points="16,64 44,64 44,80 16,80" fill={C_BACK} />
  </svg>
);

const LetterH = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="44,0 60,0 60,80 44,80" fill={C_FACE} />
    <polygon points="16,32 44,32 44,48 16,48" fill={C_BACK} />
  </svg>
);

const LetterV = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 38,80 22,80" fill={C_FACE} />
    <polygon points="60,0 44,0 22,80 38,80" fill={C_BACK} />
  </svg>
);

const LetterY = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 38,40 22,40" fill={C_FACE} />
    <polygon points="60,0 44,0 22,40 38,40" fill={C_BACK} />
    <polygon points="22,40 38,40 38,80 22,80" fill={C_FACE} />
  </svg>
);

const LetterB = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 50,0 60,16 60,32 50,40 16,40" fill={C_BACK} />
    <polygon points="16,16 44,16 44,24 16,24" fill={C_FACE} />
    <polygon points="16,40 50,40 60,56 60,80 16,80" fill={C_FACE} />
    <polygon points="16,56 44,56 44,64 16,64" fill={C_BACK} />
  </svg>
);

const LetterG = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="16,0 60,0 60,16 16,16" fill={C_BACK} />
    <polygon points="16,64 60,64 60,80 16,80" fill={C_FACE} />
    <polygon points="44,40 60,40 60,64 44,64" fill={C_BACK} />
    <polygon points="32,40 44,40 44,56 32,56" fill={C_FACE} />
  </svg>
);

const LetterI = () => (
  <svg viewBox="-10 -10 80 100" className="w-[0.6em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
  </svg>
);

const LetterN = () => (
  <svg viewBox="-10 -10 80 100" className="w-[1.2em] h-[1.5em] overflow-visible" style={{ filter: "drop-shadow(3px 8px 6px rgba(0,0,0,0.4)) drop-shadow(0px 3px 3px rgba(0,0,0,0.6))" }}>
    <polygon points="0,0 16,0 16,80 0,80" fill={C_FACE} />
    <polygon points="44,0 60,0 60,80 44,80" fill={C_FACE} />
    <polygon points="16,0 32,0 44,80 28,80" fill={C_BACK} />
  </svg>
);

export const OrigamiText = ({ text = "KAMPUSKART", className = "" }) => {
  const renderChar = (char, index) => {
    if (char === ' ') return <div key={index} className="inline-block w-[0.5em]"></div>;
    
    let Component;
    switch (char.toUpperCase()) {
      case 'K': Component = LetterK; break;
      case 'A': Component = LetterA; break;
      case 'M': Component = LetterM; break;
      case 'P': Component = LetterP; break;
      case 'U': Component = LetterU; break;
      case 'S': Component = LetterS; break;
      case 'R': Component = LetterR; break;
      case 'T': Component = LetterT; break;
      case 'W': Component = LetterW; break;
      case 'E': Component = LetterE; break;
      case 'L': Component = LetterL; break;
      case 'C': Component = LetterC; break;
      case 'O': Component = LetterO; break;
      case 'H': Component = LetterH; break;
      case 'V': Component = LetterV; break;
      case 'Y': Component = LetterY; break;
      case 'B': Component = LetterB; break;
      case 'G': Component = LetterG; break;
      case 'I': Component = LetterI; break;
      case 'N': Component = LetterN; break;
      default: return null;
    }
    return (
      <div key={index} className="inline-block mx-[0.05em] transition-transform hover:scale-110 hover:-translate-y-3 hover:rotate-2 duration-300">
        <Component />
      </div>
    );
  };

  return (
    <div className={`flex items-end justify-center ${className}`}>
      {text.split('').map(renderChar)}
    </div>
  );
};
