import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import NavLink from '../components/NavLink';
import bagImage from '../assets/origami_bag.png';
import PaperBirds from '../components/PaperBirds'; // 3D Origami Birds for BG

const TrustBadge = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-[#1B5E20]">{title}</h5>
      <p className="text-xs text-[#8D6E63]">{desc}</p>
    </div>
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const { user, ordersEnabled } = useAuth();
  const { carts, activeCartId, setActiveCartId, fetchCart, updateItem, removeItem, deleteCart, createCart } = useCart();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCartName, setNewCartName] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      fetchCart();
    }
  }, [user]);

  const activeCart = (Array.isArray(carts) ? carts : []).find(c => c._id === activeCartId) || { items: [] };

  const handleCreateCart = async () => {
    if (newCartName.trim()) {
      await createCart(newCartName.trim());
      setShowCreateModal(false);
      setNewCartName('');
    }
  };

  const handleUpdateQty = async (itemIndex, newQty) => {
    try {
      if (!activeCartId) return;
      await updateItem(activeCartId, itemIndex, { qty: newQty });
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleUpdateSides = async (itemIndex, newSides) => {
    try {
      if (!activeCartId) return;
      const newSideType = newSides === 2 ? 'double' : 'single';
      await updateItem(activeCartId, itemIndex, { sides: newSides, sideType: newSideType });
    } catch (error) {
      alert('Failed to update sides');
    }
  };

  const handleRemove = async (itemIndex) => {
    try {
      if (!activeCartId) return;
      await removeItem(activeCartId, itemIndex);
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleDeleteCart = async () => {
    if (!activeCartId) return;
    if (confirm(`Are you sure you want to delete ${activeCart.name}?`)) {
      try {
        await deleteCart(activeCartId);
      } catch (err) {
        alert('Failed to delete cart');
      }
    }
  };

  const handlePlaceOrderClick = () => {
    if (!ordersEnabled) {
      if (!user || !user.isAdmin) {
        alert(
          "We've received more orders than expected.\n" +
          "Orders are temporarily paused.\n" +
          "Please check back shortly or contact admin for urgent needs."
        );
        return;
      }
    }
    // Navigate to checkout with the specific cartId
    navigate(`/checkout?cartId=${activeCartId}`);
  };

  const total = (activeCart.items || []).reduce((sum, item) => sum + ((item.userPrice ?? item.price ?? 0) * (item.qty || 1)), 0);
  const totalItems = activeCart.items ? activeCart.items.reduce((sum, item) => sum + (item.qty || 1), 0) : 0;

  return (
    <div className="min-h-screen bg-[#F9F7F1] pt-24 pb-12 px-4 md:px-8 font-sans relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#E8E8E8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
      
      {/* 3D Origami Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <PaperBirds />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FDFCF9] text-[#4A3B32] border border-[#E8E8E8] rounded-full hover:bg-[#F5F5F5] transition-colors shadow-sm font-bold"
            >
              <span className="text-[#388E3C] font-bold text-lg">←</span> Back
            </button>
            <h1 className="text-3xl font-bold text-[#1B5E20] flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#388E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Carts
            </h1>
          </div>
        </div>

        {/* Cart Tabs */}
        {carts && carts.length > 0 && (
          <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 custom-scrollbar">
            {carts.map(c => (
              <button
                key={c._id}
                onClick={() => setActiveCartId(c._id)}
                className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeCartId === c._id 
                    ? 'bg-white text-[#1B5E20] border-t-4 border-[#388E3C] shadow-sm transform translate-y-1' 
                    : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#D5E2D1] border-t-4 border-transparent'
                }`}
              >
                {c.name}
                <span className="bg-[#1B5E20] text-white text-[10px] px-2 py-0.5 rounded-full">{c.items?.length || 0}</span>
              </button>
            ))}
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 ml-2 rounded-lg font-bold text-sm bg-white/50 border border-dashed border-[#388E3C] text-[#388E3C] hover:bg-[#E8F5E9] transition-colors flex items-center gap-1 whitespace-nowrap shadow-sm"
            >
              + Add Another Cart
            </button>
          </div>
        )}

        {!carts || carts.length === 0 || !activeCart.items || activeCart.items.length === 0 ? (
          <div className="bg-white rounded-b-2xl rounded-tr-2xl p-12 text-center shadow-sm border border-[#E8E8E8] max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#4A3B32] mb-4">This cart is empty</h2>
            <p className="text-[#8D6E63] mb-8">Looks like you haven't added any study materials here yet.</p>
            <div className="flex items-center justify-center gap-4">
              <NavLink to="/workbook" className="inline-block px-8 py-3 bg-[#388E3C] text-white font-bold rounded-lg hover:bg-[#2E7D32] transition-colors shadow-md">
                Browse Workbook
              </NavLink>
              {carts && carts.length > 1 && (
                <button 
                  onClick={handleDeleteCart}
                  className="px-8 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                >
                  Delete Empty Cart
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-b-xl rounded-tr-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E8E8E8] p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col gap-2">
                {activeCart.items.map((item, index) => (
                  <CartItem
                    key={index}
                    item={item}
                    itemIndex={index}
                    onUpdateQty={handleUpdateQty}
                    onUpdateSides={handleUpdateSides}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="relative bg-[#FDFCF9] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 md:p-8 border border-[#E8E8E8] overflow-hidden">
                
                {/* Folded Corner Effect */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-20">
                  <div className="absolute top-0 right-0 w-full h-full bg-[#1B5E20] clip-path-polygon-[0_0,100%_0,100%_100%] rounded-tr-xl"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-[#FDFCF9] shadow-[-4px_4px_8px_rgba(0,0,0,0.15)] clip-path-polygon-[0_0,0_100%,100%_100%] rounded-bl-lg"></div>
                </div>

                {/* Origami Bag Image */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="relative">
                    <img src={bagImage} alt="Origami Shopping Bag" className="w-32 h-32 object-contain drop-shadow-xl" />
                    {/* Checkmark badge */}
                    <div className="absolute bottom-4 right-0 bg-white rounded-full p-1 shadow-md border border-[#E8E8E8]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#388E3C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-[#D5E2D1] flex-1"></div>
                  <h3 className="text-lg font-bold text-[#1B5E20]">Order Summary</h3>
                  <div className="h-px bg-[#D5E2D1] flex-1"></div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[#4A3B32] font-medium text-sm">
                    <span>Total Items</span>
                    <span className="font-bold">{totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-[#D5E2D1]">
                    <span className="text-sm font-bold text-[#4A3B32]">Total Amount</span>
                    <span className="text-2xl font-bold text-[#1B5E20]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-[#E8F5E9] rounded-lg p-3 mb-6 flex items-start gap-3 border border-[#C8E6C9]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h5 className="text-xs font-bold text-[#1B5E20]">Best quality printing</h5>
                    <p className="text-[10px] text-[#2E7D32] mt-0.5 font-medium">Carefully packed & delivered</p>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrderClick}
                  className="w-full py-3.5 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white font-bold rounded-lg shadow-[0_4px_15px_rgba(46,125,50,0.4)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-45 -mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Checkout {activeCart.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust Banners */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-[#E8E8E8] py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 w-full relative z-10">
          <TrustBadge 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            title="Secure Payment" 
            desc="100% protected" 
          />
          <div className="w-full md:w-px h-px md:h-10 bg-[#E8E8E8]"></div>
          
          <TrustBadge 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            title="Quality Printing" 
            desc="Premium & neat" 
          />
          <div className="w-full md:w-px h-px md:h-10 bg-[#E8E8E8]"></div>
          
          <TrustBadge 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /><circle cx="16" cy="12" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" /></svg>}
            title="Fast Delivery" 
            desc="Quick & reliable" 
          />
          <div className="w-full md:w-px h-px md:h-10 bg-[#E8E8E8]"></div>
          
          <TrustBadge 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Eco Friendly" 
            desc="Paper with care" 
          />
        </div>

      </div>
      {/* Create Cart Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="realistic-paper-card w-full max-w-md p-8 relative transform -rotate-1 shadow-2xl">
            {/* Fold effect corner */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-ink/20 shadow-sm rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
            
            <button onClick={() => { setShowCreateModal(false); setNewCartName(''); }} className="absolute top-4 right-4 text-[#B8860B]/60 hover:text-[#B8860B] text-xl font-bold font-serif hover:scale-110 transition-transform">
              ✕
            </button>
            <h3 className="text-2xl font-bold font-serif text-[#B8860B] mb-2">Scribe a New Cart</h3>
            <p className="text-[#B8860B]/80 text-sm mb-6 font-serif">What shall we name this new collection of knowledge?</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Fall Semester Texts..." 
                className="flex-1 bg-[#FAF8F2] border-2 border-dashed border-[#B8860B] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 font-serif text-[#1a422a] placeholder:text-[#1a422a]/50 transition-all shadow-inner"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCart()}
                autoFocus
              />
              <button 
                onClick={handleCreateCart}
                disabled={!newCartName.trim()}
                className="bg-[#B8860B] text-[#FAF8F2] px-4 py-2 rounded-sm text-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] disabled:opacity-50 transition-all font-serif"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
