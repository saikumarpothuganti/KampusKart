import React from 'react';

// Common shadow for the 3D origami look
const shadowStyle = { filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.3)) drop-shadow(0px 2px 2px rgba(0,0,0,0.4))" };

// Colors
const L_GREEN = "#599A69"; // Light Green fold
const B_GREEN = "#3A764A"; // Base Green fold
const D_GREEN = "#1a3625"; // Dark Green fold
const L_PAPER = "#FDFCF9"; // Light White/Cream paper fold
const D_PAPER = "#D5E2D1"; // Shaded White paper fold

export const OrigamiCart = ({ className = "w-8 h-8" }) => (
  <div className={`relative inline-block ${className}`} style={{ filter: "drop-shadow(2px 5px 4px rgba(0,0,0,0.4)) drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }}>
    {/* 3D Thickness Layer (Darker Cream/Shadow) */}
    <svg viewBox="0 0 24 24" fill="none" stroke={D_PAPER} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="bevel" className="absolute top-[2px] left-[2px] w-full h-full">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    {/* Top Paper Layer (Light Cream) */}
    <svg viewBox="0 0 24 24" fill="none" stroke={L_PAPER} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="bevel" className="absolute top-0 left-0 w-full h-full">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  </div>
);

export const OrigamiBook = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Pages */}
    <polygon points="10,10 50,20 50,90 10,80" fill={L_PAPER} />
    <polygon points="90,10 50,20 50,90 90,80" fill={D_PAPER} />
    {/* Cover Flaps */}
    <polygon points="10,10 15,25 50,30 45,15" fill={B_GREEN} />
    <polygon points="90,10 85,25 50,30 55,15" fill={D_GREEN} />
  </svg>
);

export const OrigamiPlane = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    <polygon points="10,40 40,50 90,10" fill={L_PAPER} />
    <polygon points="40,50 50,90 90,10" fill={D_PAPER} />
    <polygon points="40,50 50,70 60,60" fill={B_GREEN} />
    <polygon points="10,40 40,50 30,60" fill={D_GREEN} />
  </svg>
);

export const OrigamiTag = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    <polygon points="10,50 50,10 90,50 50,90" fill={L_PAPER} />
    <polygon points="10,50 50,10 50,50" fill={D_PAPER} />
    {/* Green Folded Header */}
    <polygon points="50,10 90,50 80,40 40,0" fill={B_GREEN} />
    {/* Hole */}
    <circle cx="50" cy="30" r="8" fill="#1D3525" />
  </svg>
);

export const OrigamiUser = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Head */}
    <polygon points="50,10 70,30 50,50 30,30" fill={B_GREEN} />
    <polygon points="30,30 50,10 50,50" fill={L_GREEN} />
    {/* Body */}
    <polygon points="20,90 50,60 80,90" fill={L_PAPER} />
    <polygon points="50,60 80,90 50,90" fill={D_PAPER} />
    {/* Tie / Fold */}
    <polygon points="50,60 60,75 50,90 40,75" fill={D_GREEN} />
  </svg>
);

export const OrigamiCamera = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Box */}
    <polygon points="10,30 90,30 90,80 10,80" fill={B_GREEN} />
    <polygon points="10,30 50,50 90,30" fill={D_GREEN} />
    <polygon points="10,30 50,50 10,80" fill={L_GREEN} />
    {/* Flash Fold */}
    <polygon points="70,15 85,30 55,30" fill={L_PAPER} />
    {/* Lens */}
    <polygon points="35,45 65,45 80,65 50,85 20,65" fill={L_PAPER} />
    <polygon points="35,45 50,55 65,45" fill={D_PAPER} />
  </svg>
);

export const OrigamiLock = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Shackle */}
    <polygon points="30,40 30,20 70,20 70,40 60,40 60,30 40,30 40,40" fill={D_PAPER} />
    {/* Body */}
    <polygon points="20,40 80,40 80,90 20,90" fill={B_GREEN} />
    <polygon points="20,40 50,65 80,40" fill={L_GREEN} />
    <polygon points="50,65 80,90 20,90" fill={D_GREEN} />
    {/* Keyhole */}
    <polygon points="45,60 55,60 50,75" fill="#1a3625" />
  </svg>
);

export const OrigamiLogOut = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Door */}
    <polygon points="20,10 60,20 60,80 20,90" fill={L_PAPER} />
    <polygon points="20,10 60,20 20,90" fill={D_PAPER} />
    {/* Arrow */}
    <polygon points="50,45 80,45 80,35 100,50 80,65 80,55 50,55" fill={B_GREEN} />
    <polygon points="80,35 100,50 80,50" fill={L_GREEN} />
  </svg>
);

export const OrigamiCalendar = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Board */}
    <polygon points="15,20 85,20 85,90 15,90" fill={L_PAPER} />
    <polygon points="15,20 85,20 15,90" fill={D_PAPER} />
    {/* Top Bar */}
    <polygon points="10,15 90,15 90,35 10,35" fill={B_GREEN} />
    <polygon points="10,15 90,15 10,35" fill={L_GREEN} />
    {/* Date Fold */}
    <polygon points="40,50 60,50 50,70" fill={D_GREEN} />
  </svg>
);

export const OrigamiBag = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Bag Body */}
    <polygon points="20,30 80,30 70,90 30,90" fill={B_GREEN} />
    <polygon points="20,30 50,60 80,30" fill={L_GREEN} />
    <polygon points="30,90 50,60 70,90" fill={D_GREEN} />
    {/* Handles */}
    <polygon points="35,30 35,10 65,10 65,30 55,30 55,20 45,20 45,30" fill={D_PAPER} />
  </svg>
);

export const OrigamiPackage = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Box Top */}
    <polygon points="50,15 90,35 50,55 10,35" fill={L_GREEN} />
    <polygon points="50,15 50,55 10,35" fill={B_GREEN} />
    {/* Box Left */}
    <polygon points="10,35 50,55 50,90 10,70" fill={L_PAPER} />
    <polygon points="10,35 50,55 10,70" fill={D_PAPER} />
    {/* Box Right */}
    <polygon points="50,55 90,35 90,70 50,90" fill={D_GREEN} />
  </svg>
);

export const OrigamiStar = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    <polygon points="50,5 61,35 95,35 50,50" fill={L_GREEN} />
    <polygon points="95,35 68,55 50,50" fill={B_GREEN} />
    <polygon points="68,55 78,90 50,68 50,50" fill={D_GREEN} />
    <polygon points="78,90 50,68 22,90 50,50" fill={B_GREEN} />
    <polygon points="22,90 32,55 50,50" fill={L_GREEN} />
    <polygon points="32,55 5,35 50,50" fill={B_GREEN} />
    <polygon points="5,35 39,35 50,5 50,50" fill={L_PAPER} />
  </svg>
);

export const OrigamiClipboard = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    {/* Board */}
    <polygon points="20,15 80,15 80,95 20,95" fill={L_PAPER} />
    <polygon points="20,15 80,15 20,95" fill={D_PAPER} />
    {/* Clip */}
    <polygon points="35,5 65,5 70,25 30,25" fill={B_GREEN} />
    <polygon points="35,5 65,5 30,25" fill={L_GREEN} />
    {/* Checkmark */}
    <polygon points="35,55 45,65 70,40 60,35 45,50 40,45" fill={D_GREEN} />
  </svg>
);

export const OrigamiShield = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    <polygon points="10,20 50,10 90,20 80,70 50,95 20,70" fill={B_GREEN} />
    <polygon points="10,20 50,10 50,95 20,70" fill={L_GREEN} />
    {/* Inner Shield */}
    <polygon points="25,30 50,22 75,30 68,65 50,82 32,65" fill={L_PAPER} />
    <polygon points="25,30 50,22 50,82 32,65" fill={D_PAPER} />
  </svg>
);

export const OrigamiChevronRight = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={shadowStyle}>
    <polygon points="30,20 70,50 30,80 40,50" fill={B_GREEN} />
    <polygon points="30,20 70,50 40,50" fill={L_PAPER} />
  </svg>
);
