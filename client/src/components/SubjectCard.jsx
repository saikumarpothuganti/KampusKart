import React from 'react';
import KLlogo from '../assets/KLlogo.png';
import basicBookImg from '../assets/basic books (1).jpeg';
import standardBookImg from '../assets/standard books.jpeg';
import '../styles/CardAnimations.css';

const SubjectCard = ({ subject, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [sideType, setSideType] = React.useState('double');
  const [quality, setQuality] = React.useState(
    (subject.basic_singleSidePrice !== undefined && subject.basic_singleSidePrice !== null) || 
    (subject.basic_doubleSidePrice !== undefined && subject.basic_doubleSidePrice !== null) 
      ? 'basic' 
      : 'standard'
  );
  const [showPreview, setShowPreview] = React.useState(false);

  const getDisplayPrice = () => {
    if (quality === 'basic') {
      return sideType === 'single' ? subject.basic_singleSidePrice : subject.basic_doubleSidePrice;
    }
    if (quality === 'premium') {
      return sideType === 'single' ? subject.premium_singleSidePrice : subject.premium_doubleSidePrice;
    }
    // Standard
    return sideType === 'single' ? subject.singleSidePrice : subject.doubleSidePrice;
  };

  const displayPrice = getDisplayPrice();

  const handleAddToCart = () => {
    onAddToCart({
      type: 'subject',
      subjectId: subject._id,
      title: subject.title,
      code: subject.code,
      qty: quantity,
      sides: sideType === 'double' ? 2 : 1,
      sideType,
      quality,
      pricePerPage: displayPrice,
      price: displayPrice,
    });
    setQuantity(1);
    setSideType('double');
    setQuality(
      (subject.basic_singleSidePrice !== undefined && subject.basic_singleSidePrice !== null) || 
      (subject.basic_doubleSidePrice !== undefined && subject.basic_doubleSidePrice !== null) 
        ? 'basic' 
        : 'standard'
    );
  };

  const available = subject.availability !== false;

  return (
    <div className="realistic-paper-card p-3 min-h-[320px] h-full flex flex-col text-paper transform transition-all hover:scale-[1.01] hover:shadow-[8px_8px_0px_#18382A]">
      
      {/* Decorative Pin */}
      <div className="absolute -top-3 right-4 text-2xl drop-shadow-md z-10" style={{ transform: 'rotate(15deg)' }}>📌</div>

      <img
        src={KLlogo}
        alt="KL University"
        className="h-[48px] w-[85%] mx-auto mb-2 rounded-md logo-grow object-cover object-[center_35%] border border-[rgba(255,255,255,0.1)] shadow-inner"
      />

      <div className="flex-1 space-y-2">
        <h3 className="text-sm sm:text-base font-serif font-bold mb-0.5 leading-tight">{subject.title}</h3>
        <p className="text-[9px] sm:text-[10px] mb-1.5 opacity-80 font-mono tracking-wider">CODE: {subject.code}</p>
        <div className="flex items-center justify-between mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1.5">
          <div className="flex flex-col">
            {displayPrice !== null && displayPrice !== undefined ? (
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl text-paper/80 font-extrabold line-through decoration-red-500 decoration-4 drop-shadow-md mb-0.5">
                  ₹{displayPrice + (quality === 'basic' ? 10 : 15)}
                </span>
                <p className="text-sm sm:text-base font-sans font-black text-[#B8860B] drop-shadow-md leading-none flex items-baseline gap-1.5 mt-1 uppercase tracking-tighter transform -rotate-2">
                  <span className="opacity-90">Now only:</span> <span className="text-xl sm:text-2xl tracking-normal">₹{displayPrice}</span>
                </p>
              </div>
            ) : (
              <p className="text-lg sm:text-xl font-bold text-[#EDE0C8] drop-shadow-sm">
                N/A
              </p>
            )}
          </div>
          <span className={`text-xs px-2 py-1 border rounded font-semibold tracking-wide ${available ? 'border-green-400/50 text-green-300 bg-green-900/20' : 'border-red-400/50 text-red-300 bg-red-900/20'}`}>
            {available ? 'AVAILABLE' : 'UNAVAILABLE'}
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-serif font-bold mb-1.5 opacity-90 uppercase tracking-widest">Book Quality</label>
          <div className="flex flex-col gap-1.5 mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setQuality('basic')}
                className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border relative ${
                  quality === 'basic'
                    ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                    : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                Basic
                <span className="absolute -top-2 -right-1 text-[8px] bg-red-500 text-white px-1 rounded shadow">Best seller</span>
              </button>
              <button
                onClick={() => setQuality('standard')}
                className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border ${
                  quality === 'standard'
                    ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                    : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                Standard
              </button>
              <button
                disabled={true}
                className="flex-1 py-1.5 rounded-sm text-[10px] sm:text-xs font-bold transition border bg-transparent text-paper border-[rgba(255,255,255,0.2)] opacity-50 cursor-not-allowed"
                title="Currently Out of Stock"
              >
                Premium (OOS)
              </button>
            </div>
            
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(true); }}
              className="w-full mt-2 py-1.5 bg-[rgba(0,0,0,0.2)] rounded border border-[rgba(255,255,255,0.05)] text-[10px] font-bold hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center gap-1"
            >
              <span className="text-sm">👀</span> Preview of Book
            </button>
          </div>
          
          <label className="block text-[10px] font-serif font-bold mb-1.5 opacity-90 uppercase tracking-widest">Printing Type</label>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSideType('single')}
              className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border ${
                sideType === 'single'
                  ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                  : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Single-side
            </button>
            <button
              onClick={() => setSideType('double')}
              className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border ${
                sideType === 'double'
                  ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                  : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Double-side
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-serif font-bold mb-1.5 opacity-90 uppercase tracking-widest">Quantity</label>
          <div className="flex items-center gap-1.5 mb-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm text-paper font-bold transition"
            >
              -
            </button>
            <span className="px-4 text-paper font-bold bg-[rgba(0,0,0,0.2)] py-1 rounded-sm shadow-inner">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm text-paper font-bold transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1.5 mt-2">
        {subject.pdfUrl && (
          <a
            href={subject.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[rgba(255,255,255,0.1)] text-paper border border-[rgba(255,255,255,0.3)] text-sm py-2 rounded-sm font-bold text-center hover:bg-[rgba(255,255,255,0.2)] transition shadow-sm"
          >
            👁️ View PDF
          </a>
        )}
        <button
          onClick={handleAddToCart}
          disabled={!available || displayPrice === null || displayPrice === undefined}
          className="w-full bg-[#EDE0C8] text-ink border-2 border-[#D5CEBA] text-sm py-2 rounded-sm font-bold hover:bg-[#F5EBD6] hover:scale-[1.02] shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {available && displayPrice !== null && displayPrice !== undefined ? 'Add to Cart' : 'Unavailable for this selection'}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && quality !== 'premium' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}>
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 text-white hover:text-red-400 text-3xl font-bold"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}
            >
              &times;
            </button>
            <img 
              src={quality === 'basic' ? basicBookImg : standardBookImg} 
              alt={`${quality} book preview`} 
              className="w-full h-auto rounded-lg shadow-2xl border-2 border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
