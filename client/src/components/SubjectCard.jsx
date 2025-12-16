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
    <div className="bg-[#1f1f1f] rounded-2xl shadow-md p-4 pb-6 h-[440px] flex flex-col transition-transform duration-150 ease-out hover:scale-[1.02] hover:shadow-lg card-glow-border">
      <img
        src={KLlogo}
        alt="KL University"
        className="h-24 w-full mb-3 rounded-xl logo-grow object-cover"
      />

      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-semibold mb-2 text-white">{subject.title}</h3>
        <p className="text-sm mb-2 text-gray-300">Code: {subject.code}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-primary font-bold text-base">₹{displayPrice}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-600 text-gray-200'}`}>
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-white">Printing Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSideType('single')}
              className={`flex-1 py-2 rounded text-xs font-semibold transition ${
                sideType === 'single'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Single-side
            </button>
            <button
              onClick={() => setSideType('double')}
              className={`flex-1 py-2 rounded text-xs font-semibold transition ${
                sideType === 'double'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Double-side
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-white">Quantity</label>
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 px-2.5 py-1 rounded text-black text-sm"
            >
              -
            </button>
            <span className="px-3 text-white text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 px-2.5 py-1 rounded text-black text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!available}
        className="mt-auto mt-4 mb-3 w-full bg-primary text-white text-sm py-1.5 rounded-md font-semibold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {available ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
};

export default SubjectCard;
