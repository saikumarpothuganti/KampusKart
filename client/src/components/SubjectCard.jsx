import React from 'react';
import KLlogo from '../assets/KLlogo.png';
import '../styles/CardAnimations.css';

const SubjectCard = ({ subject, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [sideType, setSideType] = React.useState('single');

  const getDisplayPrice = () => {
    if (sideType === 'single') return subject.singleSidePrice ?? 0;
    if (sideType === 'double') return subject.doubleSidePrice ?? 0;
    return 0;
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
      pricePerPage: displayPrice,
      price: displayPrice,
    });
    setQuantity(1);
    setSideType('single');
  };

  const available = subject.availability !== false;

  return (
    <div className="realistic-paper-card p-6 min-h-[460px] h-full flex flex-col text-paper">
      
      {/* Decorative Pin */}
      <div className="absolute -top-3 right-4 text-2xl drop-shadow-md z-10" style={{ transform: 'rotate(15deg)' }}>📌</div>

      <img
        src={KLlogo}
        alt="KL University"
        className="h-24 w-full mb-4 rounded-md logo-grow object-cover border border-[rgba(255,255,255,0.1)] shadow-inner"
      />

      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-serif font-bold mb-1 leading-tight">{subject.title}</h3>
        <p className="text-xs mb-2 opacity-80 font-mono tracking-wider">CODE: {subject.code}</p>
        <div className="flex items-center justify-between mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">
          <p className="text-xl font-bold text-[#EDE0C8] drop-shadow-sm">₹{displayPrice}</p>
          <span className={`text-xs px-2 py-1 border rounded font-semibold tracking-wide ${available ? 'border-green-400/50 text-green-300 bg-green-900/20' : 'border-red-400/50 text-red-300 bg-red-900/20'}`}>
            {available ? 'AVAILABLE' : 'UNAVAILABLE'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Printing Type</label>
          <div className="flex gap-2">
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
          <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Quantity</label>
          <div className="flex items-center gap-1.5 mb-2">
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

      <div className="mt-auto flex flex-col gap-2 mt-4">
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
          disabled={!available}
          className="w-full bg-[#EDE0C8] text-ink border-2 border-[#D5CEBA] text-sm py-2 rounded-sm font-bold hover:bg-[#F5EBD6] hover:scale-[1.02] shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
