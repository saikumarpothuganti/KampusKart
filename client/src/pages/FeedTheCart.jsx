import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, PerspectiveCamera, OrbitControls, Environment, Float, ContactShadows, Html, Tetrahedron } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import bgImage from '../assets/feed the cart.jpeg';

// --- THREE.JS CART & FALLING BOOKS SCENE ---
const Book = ({ position, rotation, color, scale = 1 }) => {
  const meshRef = useRef();
  const [targetY] = useState(position[1]);
  const [startY] = useState(position[1] + 6); // start 6 units above
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.y = startY;
    }
  }, [startY]);

  useFrame((state, delta) => {
    if (meshRef.current && meshRef.current.position.y > targetY) {
      // Fall down rapidly
      meshRef.current.position.y -= delta * 15;
      
      // Simple bounce effect when hitting the bottom
      if (meshRef.current.position.y < targetY) {
        meshRef.current.position.y = targetY;
      }
    }
  });

  return (
    <Box ref={meshRef} args={[1.5 * scale, 2 * scale, 0.3 * scale]} position={[position[0], startY, position[2]]} rotation={rotation} castShadow>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </Box>
  );
};

const OrigamiGreenCart = () => {
  const greenMat = <meshStandardMaterial color="#558b2f" roughness={0.8} metalness={0.1} flatShading />;
  const wheelMat = <meshStandardMaterial color="#33691e" roughness={0.9} flatShading />;
  
  return (
    <group position={[0, -1, 0]}>
      {/* Base */}
      <Box args={[2.5, 0.3, 1.8]} position={[0, 0, 0]} receiveShadow castShadow>
        {greenMat}
      </Box>
      
      {/* Front angled piece */}
      <Box args={[0.3, 1.8, 1.8]} position={[1.3, 0.8, 0]} rotation={[0, 0, -0.4]} receiveShadow castShadow>
        {greenMat}
      </Box>
      
      {/* Back angled piece */}
      <Box args={[0.3, 1.5, 1.8]} position={[-1.3, 0.6, 0]} rotation={[0, 0, 0.2]} receiveShadow castShadow>
        {greenMat}
      </Box>

      {/* Side walls */}
      <Box args={[2.8, 1.2, 0.2]} position={[0, 0.6, -0.9]} rotation={[0, 0, -0.1]} receiveShadow castShadow>
        {greenMat}
      </Box>
      <Box args={[2.8, 1.2, 0.2]} position={[0, 0.6, 0.9]} rotation={[0, 0, -0.1]} receiveShadow castShadow>
        {greenMat}
      </Box>

      {/* Front beak (origami style) */}
      <Tetrahedron args={[0.8, 0]} position={[-2, 1.2, 0]} rotation={[Math.PI/4, 0, Math.PI/2]} castShadow>
        {greenMat}
      </Tetrahedron>

      {/* Hexagonal Wheels */}
      <Cylinder args={[0.35, 0.35, 0.2, 6]} position={[-0.8, -0.3, 0.8]} rotation={[Math.PI/2, 0, 0]} castShadow>
        {wheelMat}
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.2, 6]} position={[0.8, -0.3, 0.8]} rotation={[Math.PI/2, 0, 0]} castShadow>
        {wheelMat}
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.2, 6]} position={[-0.8, -0.3, -0.8]} rotation={[Math.PI/2, 0, 0]} castShadow>
        {wheelMat}
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.2, 6]} position={[0.8, -0.3, -0.8]} rotation={[Math.PI/2, 0, 0]} castShadow>
        {wheelMat}
      </Cylinder>
    </group>
  );
};

const DynamicCartScene = ({ qty }) => {
  const books = useMemo(() => {
    const b = [];
    for (let i = 0; i < Math.min(qty, 20); i++) {
      b.push({
        id: i,
        // Make books stay nicely bunched in the center of the cart to avoid clipping
        position: [(Math.random() - 0.5) * 0.8, (i * 0.15) - 0.5, (Math.random() - 0.5) * 0.6],
        rotation: [Math.PI/2 + (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.2],
        color: Math.random() > 0.5 ? '#d7ccc8' : '#a1887f'
      });
    }
    return b;
  }, [qty]);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4, 8], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <spotLight position={[-5, 5, 5]} intensity={0.8} color="#D4AF37" />
      
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
        <group>
          <OrigamiGreenCart />
          {books.map(b => (
            // Scale books down a bit more so they fit well inside
            <Book key={b.id} {...b} scale={0.5} />
          ))}
          
          {/* Convo Bubble - lowered so it doesn't get cut off */}
          <Html position={[1.2, 1.8, 0]} center className="pointer-events-none">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-[#1B5E20] whitespace-nowrap animate-bounce relative z-50 mt-4">
              <span className="font-black text-[#1B5E20] text-sm">FEED ME! ⚡</span>
              <span className="block text-[10px] text-[#8D6E63] font-bold">I NEED ENERGY!</span>
              {/* Bubble Tail */}
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1B5E20] rotate-45"></div>
            </div>
          </Html>
        </group>
      </Float>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#1B5E20" />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} maxPolarAngle={Math.PI/2 - 0.1} />
    </Canvas>
  );
};

// --- FEED THE CART PAGE ---
const FeedTheCart = () => {
  const navigate = useNavigate();
  const { carts, activeCartId, updateItem, removeItem } = useCart();
  const activeCart = (Array.isArray(carts) ? carts : []).find(c => c._id === activeCartId) || { items: [] };

  const displayEnergy = activeCart.displayEnergy || 0;
  const currentRewardLevel = activeCart.currentRewardLevel || 0;
  const totalQty = activeCart.items ? activeCart.items.reduce((sum, item) => sum + (item.qty || 1), 0) : 0;

  const milestones = [100, 200, 300, 400, 500, 600];
  const maxEnergy = 600; // Cap visual at 600 so the 6th gift is at the end
  const progressPercent = Math.min((displayEnergy / maxEnergy) * 100, 100);

  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [hasShownBulkPopup, setHasShownBulkPopup] = useState(false);

  useEffect(() => {
    if (displayEnergy >= 700 && !hasShownBulkPopup) {
      // Delay slightly so they see the energy bar fill up first
      const timer = setTimeout(() => {
        setShowBulkPopup(true);
        setHasShownBulkPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [displayEnergy, hasShownBulkPopup]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRemove = async (itemIndex) => {
    try {
      await removeItem(activeCartId, itemIndex);
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleUpdateQty = async (itemIndex, newQty) => {
    try {
      await updateItem(activeCartId, itemIndex, { qty: newQty });
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  return (
    <div 
      className="min-h-screen font-sans pt-8 pb-12 selection:bg-[#D4AF37]/30 bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background overlay removed for full visibility of custom image */}
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 text-[#E8D9B4]">
        


        {/* Hero Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-[#E8D9B4] tracking-tighter mb-2" style={{ textShadow: '0 4px 15px rgba(212,175,55,0.4), 0 2px 2px rgba(0,0,0,0.8)' }}>
            FEED THE CART <span className="text-xs align-top bg-[#2D503C] text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/50 rounded-sm font-bold tracking-widest">BETA</span>
          </h1>
          <p className="text-[#A3B8A8] text-lg font-bold">Our cart is hungry! Feed him and give energy to get <span className="text-[#81C784]">discounts!</span></p>
        </div>

        {/* Info Banner - MOVED TO TOP */}
        <div className="mb-10 bg-[#132C1B]/80 backdrop-blur-sm border border-[#2D503C] shadow-2xl p-6 flex flex-wrap gap-8 justify-center lg:justify-between items-center rounded-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <p className="text-[#E8D9B4] font-bold text-sm">Add More Books</p>
              <p className="text-[#8D7F67] text-xs">Add workbooks to your cart</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl text-[#D4AF37]">⚡</span>
            <div>
              <p className="text-[#E8D9B4] font-bold text-sm">Generate Energy</p>
              <p className="text-[#8D7F67] text-xs">Every workbook adds Energy.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <p className="text-[#E8D9B4] font-bold text-sm">Unlock Discounts</p>
              <p className="text-[#8D7F67] text-xs">Unlock a discount on each reward.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-[#E8D9B4] font-bold text-sm">Save More</p>
              <p className="text-[#8D7F67] text-xs">Rewards applied automatically.</p>
            </div>
          </div>
        </div>

        {/* Main Layout - 3 COLUMNS */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN: My Cart (Paper Style) */}
          <div className="w-full lg:w-[45%] shrink-0 relative h-full order-2 lg:order-1">
            {/* Paper Background */}
            <div className="bg-[#F4EFE6] shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-6 md:p-8 relative h-full text-[#3A3327]"
                 style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>
              
              {/* Paper Fold Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#E5DCC5]" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1)' }}></div>
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#E5DCC5]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)', boxShadow: 'inset 2px -2px 4px rgba(0,0,0,0.1)' }}></div>
              
              {/* Header */}
              <h3 className="text-xl font-black text-[#3A3327] border-b border-[#D8CBB3] pb-4 mb-4 flex items-center gap-2 uppercase tracking-tight">
                <span className="text-2xl">🛒</span> MY CART <span className="text-sm font-medium text-[#8D7F67] capitalize normal-case tracking-normal">({totalQty} Items)</span>
              </h3>
              
              {(!activeCart.items || activeCart.items.length === 0) ? (
                <div className="py-24 text-center">
                  <div className="text-6xl mb-4 opacity-50">🛒</div>
                  <p className="text-[#3A3327] font-black text-2xl mb-2">Your cart is empty</p>
                  <button onClick={() => navigate('/workbook')} className="mt-6 px-8 py-3 bg-[#132C1B] text-[#E8D9B4] font-bold shadow-[4px_4px_0_#D4AF37] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_#D4AF37] transition-all">
                    Add Workbooks
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {activeCart.items.map((item, index) => {
                    const originalTotal = (item.price || 0) * (item.qty || 1);
                    return (
                      <div key={index} className="py-6 border-b border-[#D8CBB3] border-dashed flex flex-col xl:flex-row items-center gap-4 group">
                        
                        {/* Book Icon */}
                        <div className="w-16 h-20 bg-[#132C1B] flex flex-col justify-center items-center rounded-sm shadow-[2px_2px_5px_rgba(0,0,0,0.3)] relative shrink-0">
                          <span className="text-white font-bold text-[8px] uppercase text-center leading-tight px-1">{item.title.substring(0,20)}...</span>
                          <div className="absolute left-1 top-0 bottom-0 w-[2px] bg-white/20"></div>
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 text-center xl:text-left">
                          <h4 className="font-black text-[#3A3327] text-lg leading-tight uppercase tracking-tight">{item.title}</h4>
                          <p className="text-xs text-[#6F6450] mt-1 font-medium">Code: {item.code || '24XXX'}</p>
                          <p className="text-xs text-[#6F6450] mt-1 font-medium">Printing: {item.sideType} side • Quality: {item.quality}</p>
                          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mt-2">
                            <p className="text-sm font-black text-[#3A3327]">₹{item.price} <span className="text-xs font-normal text-[#6F6450]">per copy</span></p>
                            <span className="text-[10px] font-bold text-[#1B5E20] bg-[#81C784]/30 px-2 py-0.5 rounded-full border border-[#81C784]/50">
                              {item.quality === 'basic' ? '⚡ Generates Least Energy' : 
                               item.quality === 'premium' ? '⚡ Generates Max Energy' : 
                               '⚡ Generates Energy'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Qty & Delete */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-[#EAE3D2] rounded-full px-2 py-1 shadow-inner border border-[#D8CBB3]">
                            <button onClick={() => item.qty > 1 && handleUpdateQty(index, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-[#3A3327] font-black">−</button>
                            <span className="font-black text-[#3A3327] w-6 text-center">{item.qty || 1}</span>
                            <button onClick={() => handleUpdateQty(index, (item.qty || 1) + 1)} className="w-6 h-6 flex items-center justify-center text-[#3A3327] font-black">+</button>
                          </div>
                          
                          <button onClick={() => handleRemove(index)} className="text-[#C62828] hover:text-red-700 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Add Another Item Button */}
              {activeCart.items?.length > 0 && (
                <div className="mt-8 text-center">
                  <button onClick={() => navigate('/workbook')} className="px-6 py-2 border-2 border-dashed border-[#D8CBB3] text-[#6F6450] font-bold hover:bg-[#EAE3D2] transition rounded-sm">
                    + Add Another Item
                  </button>
                </div>
              )}
            </div>
            
            {/* Background layered paper effect */}
            <div className="absolute -bottom-2 -right-2 w-full h-full bg-[#E5DCC5] z-[-1] shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
          </div>

          {/* MIDDLE COLUMN: 3D Cart + Energy Panel */}
          <div className="w-full lg:w-[28%] shrink-0 flex flex-col gap-6 order-1 lg:order-2">
            {/* COMBINED Cart Energy Panel (Dark Green UI) */}
            <div className="bg-[#183623] border-2 border-[#2D503C] shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative overflow-hidden rounded-sm flex flex-col">
              
              {/* Corner decor */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] z-10"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] z-10"></div>
              
              {/* 3D Cart Viewport (Merged into the top of the panel) */}
              <div className="h-[320px] w-full bg-[#132C1B] relative shadow-inner">
                 <DynamicCartScene qty={totalQty} />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-[#E8D9B4] flex items-center gap-2 tracking-tighter">
                    <span className="text-[#D4AF37]">⚡</span> CART ENERGY
                  </h2>
                  <div className="bg-[#0F2417] px-3 py-1 border border-[#2D503C] shadow-inner flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#D4AF37]">{displayEnergy}</span>
                    <span className="text-[#D4AF37] text-xs font-bold">⚡</span>
                  </div>
                </div>

              {/* Glowing Progress Bar */}
              <div className="relative pt-2 pb-12 px-2">
                <div className="w-full bg-[#0F2417] h-3 rounded-full border border-[#2D503C] shadow-inner relative z-0">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#81C784] to-[#FFF176] rounded-full shadow-[0_0_15px_#FFF176]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                  >
                    {/* Sparkle on the edge */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white drop-shadow-[0_0_10px_#fff] text-lg rotate-12">⚡</div>
                  </motion.div>
                </div>
                
                {/* Milestones mimicking the mockup */}
                <div className="absolute top-2 left-0 w-full h-full pointer-events-none flex items-start z-10 px-2">
                  {milestones.map((m, i) => {
                    const percent = (m / maxEnergy) * 100;
                    const isUnlocked = displayEnergy >= m;
                    return (
                      <div key={m} className="absolute flex flex-col items-center justify-start -translate-x-1/2" style={{ left: `${percent}%` }}>
                        <div className="w-[2px] h-3 bg-[#2D503C] mb-1"></div>
                        <span className="text-[9px] font-bold text-[#A3B8A8] mb-1">{m}</span>
                        <AnimatePresence mode="wait">
                          {isUnlocked ? (
                            <motion.div 
                              key="open"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1.2 }}
                              className="text-xl drop-shadow-[0_0_10px_#D4AF37]"
                            >
                              🎁
                            </motion.div>
                          ) : (
                            <motion.div key="closed" className="text-base opacity-40 grayscale">
                              🎁
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span className={`text-[8px] font-bold mt-1 ${isUnlocked ? 'text-[#D4AF37]' : 'text-[#8D7F67]'}`}>Reward {i+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#0F2417] border border-[#2D503C] p-3 flex gap-3 items-center mt-2">
                <span className="text-xl text-[#D4AF37] opacity-80">💡</span>
                <div>
                  <p className="text-[#E8D9B4] text-xs font-bold">Cart is getting stronger!</p>
                  <p className="text-[#8D7F67] text-[9px]">Add books to unlock greater discounts.</p>
                </div>
              </div>
            </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-[#183623]/80 border border-[#2D503C] p-4 text-[#A3B8A8] text-[10px] flex gap-3 rounded-sm backdrop-blur-sm">
              <span className="text-lg">🛡️</span>
              <p>
                <strong className="text-[#E8D9B4] block">Rewards are auto-applied at checkout.</strong>
                Exact Energy calculation remains hidden to keep it fair for everyone!
              </p>
            </div>
            
          </div>

          {/* RIGHT COLUMN: Order Summary (Paper Style) */}
          <div className="w-full lg:w-[27%] shrink-0 flex flex-col gap-6 order-3">
            <div className="bg-[#F4EFE6] shadow-[0_15px_30px_rgba(0,0,0,0.6)] p-6 relative text-[#3A3327] w-full"
                 style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>
              
              {/* Paper Fold Corner */}
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#E5DCC5]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)', boxShadow: 'inset 1px -1px 2px rgba(0,0,0,0.1)' }}></div>

              <h3 className="text-lg font-black text-[#3A3327] mb-6 border-b border-[#D8CBB3] pb-3 uppercase tracking-tight flex items-center gap-2">
                <span>🧾</span> ORDER SUMMARY
              </h3>
              
              <div className="flex justify-between items-center mb-3 text-xs font-medium">
                <span className="text-[#6F6450]">Total Items</span>
                <span className="font-bold text-[#3A3327]">{totalQty}</span>
              </div>

              {/* Calculate Totals */}
              {(() => {
                const subtotal = activeCart.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0) || 0;
                const discount = activeCart.eventDiscountTotal || 0;
                const finalTotal = Math.max(0, subtotal - discount);

                return (
                  <>
                    <div className="flex justify-between items-center mb-3 text-xs font-medium">
                      <span className="text-[#6F6450]">Subtotal</span>
                      <span className="font-bold text-[#3A3327]">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between items-center mb-4 text-xs font-bold text-[#2E7D32]">
                        <span>Reward Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-[#D8CBB3] pt-4 mb-8 flex flex-col gap-1 items-start">
                      <span className="text-sm font-black text-[#3A3327] uppercase">TOTAL</span>
                      <span className="text-3xl font-black text-[#132C1B]">
                        ₹{finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </>
                );
              })()}

              <button 
                onClick={() => navigate('/checkout', { state: { fromEvent: true } })} 
                disabled={!activeCart.items || activeCart.items.length === 0}
                className="w-full py-4 bg-[#D4AF37] text-[#3A3327] font-black text-sm tracking-widest shadow-[0_4px_0_#B8972E,0_5px_10px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_#B8972E,0_0px_0_rgba(0,0,0,0)] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#B8972E]/50 rounded-sm"
              >
                CHECKOUT NOW →
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Order Popup (700+ Energy) */}
        {showBulkPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in duration-300" onClick={() => setShowBulkPopup(false)}>
            <div className="bg-[#183623] border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden rounded-md cursor-default p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowBulkPopup(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-[#A3B8A8] hover:text-white hover:bg-white/10 rounded-full font-bold text-xl transition-colors">✕</button>
              
              <div className="text-6xl mb-4 animate-bounce">📦</div>
              <h2 className="text-2xl font-black text-[#E8D9B4] tracking-tighter mb-3 uppercase" style={{ textShadow: '0 2px 10px rgba(212,175,55,0.3)' }}>
                Massive Order Detected!
              </h2>
              <p className="text-[#A3B8A8] font-bold text-lg mb-2">You're ordering a LOT of books!</p>
              <p className="text-[#8D7F67] text-sm mb-6 leading-relaxed">
                Since you're placing such a large order, we can probably get you an even better deal. <strong className="text-[#D4AF37]">Contact us directly</strong> for an exclusive bulk-order discount!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a href="https://t.me/KampusKart_Klu" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-[#0088cc] text-white font-black tracking-widest uppercase hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,136,204,0.4)] transition-all rounded-sm border border-[#006699]">
                  Telegram
                </a>
                <a href="https://www.instagram.com/kampuskart__" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-black tracking-widest uppercase hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(188,24,136,0.4)] transition-all rounded-sm">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Scroll Indicator */}
        <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-opacity duration-300 pointer-events-none ${showScrollArrow ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37] p-2 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedTheCart;
