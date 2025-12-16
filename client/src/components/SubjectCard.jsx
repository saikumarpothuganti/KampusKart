import React from 'react';
import KLlogo from '../assets/KLlogo.png';
import '../styles/CardAnimations.css';

const SubjectCard = ({ subject, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [sides, setSides] = React.useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      type: 'subject',
      subjectId: subject._id,
      title: subject.title,
      code: subject.code,
      qty: quantity,
      sides,
      price: subject.price,
    });
    setQuantity(1);
    setSides(1);
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
          <p className="text-primary font-bold text-base">₹{subject.price}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-600 text-gray-200'}`}>
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-white">Sides</label>
          <select
            value={sides}
            onChange={(e) => setSides(parseInt(e.target.value))}
            className="w-full border rounded px-2.5 py-2 text-sm text-black bg-white"
          >
            <option value={1}>Single-sided</option>
            <option value={2}>Double-sided</option>
          </select>
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
