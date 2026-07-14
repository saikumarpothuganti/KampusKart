import React from 'react';

// Reusable SVG filter for ripped paper edge
export const RippedPaperFilter = () => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      <filter id="torn-edge-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.15" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="torn-edge-filter-2" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.12" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

// Origami Flower Component
const OrigamiFlower = ({ x, y, scale = 1, rotation = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`} className="drop-shadow-lg">
    {/* Petal 1 */}
    <polygon points="0,0 8,-25 16,0" fill="#EAD1A6" />
    <polygon points="0,0 8,-25 8,0" fill="#D8BE91" />
    {/* Petal 2 */}
    <polygon points="0,0 25,-8 16,10" fill="#EAD1A6" />
    <polygon points="0,0 25,-8 12,-4" fill="#CBB184" />
    {/* Petal 3 */}
    <polygon points="0,0 20,20 0,16" fill="#EAD1A6" />
    <polygon points="0,0 20,20 10,10" fill="#D8BE91" />
    {/* Petal 4 */}
    <polygon points="0,0 -16,20 -20,0" fill="#EAD1A6" />
    <polygon points="0,0 -16,20 -8,10" fill="#CBB184" />
    {/* Petal 5 */}
    <polygon points="0,0 -20,-15 -8,-20" fill="#EAD1A6" />
    <polygon points="0,0 -20,-15 -10,-10" fill="#D8BE91" />
    {/* Center */}
    <circle cx="0" cy="0" r="4" fill="#8C6F4B" />
  </g>
);

// Origami Leaf Component
const OrigamiLeaf = ({ x, y, scale = 1, rotation = 0, color = "#2E7D32" }) => {
  // Darken color for folded half
  const darker = color === "#2E7D32" ? "#1B5E20" : (color === "#388E3C" ? "#2E7D32" : "#144517");
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`} className="drop-shadow-md">
      <polygon points="0,0 15,-30 0,-45" fill={color} />
      <polygon points="0,0 -15,-30 0,-45" fill={darker} />
      <line x1="0" y1="0" x2="0" y2="-45" stroke="#112e1c" strokeWidth="0.5" opacity="0.3" />
    </g>
  );
};

// Origami Bird Component
const OrigamiBird = ({ x, y, scale = 1, rotation = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`} className="drop-shadow-lg">
    {/* Body */}
    <polygon points="0,0 -20,10 -15,-5" fill="#388E3C" />
    <polygon points="0,0 15,5 25,-10" fill="#2E7D32" />
    {/* Wing Front */}
    <polygon points="0,0 -10,-25 15,-35" fill="#4CAF50" />
    <polygon points="0,0 -10,-25 5,-20" fill="#388E3C" />
    {/* Wing Back */}
    <polygon points="-5,-5 -25,-20 0,-25" fill="#1B5E20" />
    {/* Tail */}
    <polygon points="-15,-5 -35,-15 -20,10" fill="#1B5E20" />
    <polygon points="-15,-5 -25,-5 -20,10" fill="#144517" />
    {/* Head */}
    <polygon points="15,5 25,15 35,5" fill="#4CAF50" />
    <polygon points="25,-10 35,5 25,15" fill="#388E3C" />
    {/* Beak */}
    <polygon points="35,5 45,8 32,10" fill="#EAD1A6" />
  </g>
);

export const NavbarDecorations = () => {
  return (
    <>
      <RippedPaperFilter />
      
      {/* Ripped Bottom Edges */}
      <div 
        className="absolute top-full left-0 w-full h-[12px] bg-[#0c2415] z-10 opacity-70"
        style={{ filter: 'url(#torn-edge-filter-2)', transform: 'translateY(-2px)' }}
      ></div>
      <div 
        className="absolute top-full left-0 w-full h-[14px] bg-[#18382A] z-20 shadow-[0_8px_15px_rgba(0,0,0,0.5)]"
        style={{ filter: 'url(#torn-edge-filter)' }}
      ></div>
      
      {/* SVG Container for Left Origami */}
      <div className="absolute top-0 left-0 w-[200px] h-full pointer-events-none z-30 overflow-visible">
        <svg className="w-full h-full overflow-visible">
          {/* Left Corner Decorations */}
          <g transform="translate(30, 40)">
            <OrigamiLeaf x={-10} y={10} scale={0.8} rotation={-45} color="#1B5E20" />
            <OrigamiLeaf x={10} y={-10} scale={1.2} rotation={20} color="#388E3C" />
            <OrigamiLeaf x={-20} y={30} scale={0.9} rotation={-80} color="#2E7D32" />
            <OrigamiLeaf x={15} y={40} scale={0.6} rotation={-20} color="#4CAF50" />
            
            {/* Hanging Vine */}
            <path d="M0,20 Q-20,60 10,100 T-5,180" fill="none" stroke="#112e1c" strokeWidth="2" opacity="0.6" />
            <OrigamiLeaf x={-10} y={60} scale={0.4} rotation={-30} color="#2E7D32" />
            <OrigamiLeaf x={5} y={80} scale={0.5} rotation={40} color="#388E3C" />
            <OrigamiLeaf x={10} y={110} scale={0.4} rotation={80} color="#1B5E20" />
            <OrigamiLeaf x={-8} y={140} scale={0.6} rotation={-50} color="#2E7D32" />
            <OrigamiLeaf x={2} y={170} scale={0.3} rotation={20} color="#4CAF50" />
            
            <OrigamiFlower x={0} y={10} scale={1} rotation={15} />
          </g>
        </svg>
      </div>

      {/* SVG Container for Right Origami */}
      <div className="absolute top-0 right-0 w-[200px] h-full pointer-events-none z-30 overflow-visible">
        <svg className="w-full h-full overflow-visible">
          {/* Right Corner Decorations */}
          <g transform="translate(140, 30)">
            <OrigamiBird x={-40} y={0} scale={0.8} rotation={-15} />
            <OrigamiLeaf x={30} y={-5} scale={1.1} rotation={-130} color="#2E7D32" />
            <OrigamiLeaf x={10} y={30} scale={0.9} rotation={120} color="#1B5E20" />
            <OrigamiLeaf x={40} y={20} scale={0.7} rotation={-80} color="#388E3C" />
            
            {/* Hanging Vine */}
            <path d="M20,20 Q40,60 10,90 T20,150" fill="none" stroke="#112e1c" strokeWidth="2" opacity="0.6" />
            <OrigamiLeaf x={30} y={50} scale={0.4} rotation={40} color="#2E7D32" />
            <OrigamiLeaf x={15} y={70} scale={0.5} rotation={-30} color="#388E3C" />
            <OrigamiLeaf x={10} y={100} scale={0.4} rotation={-70} color="#1B5E20" />
            <OrigamiLeaf x={25} y={130} scale={0.5} rotation={50} color="#2E7D32" />
            
            <OrigamiFlower x={20} y={15} scale={0.8} rotation={-25} />
          </g>
        </svg>
      </div>
    </>
  );
};
