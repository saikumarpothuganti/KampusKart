import React from 'react';

// CSS-based 3D Book Cover Component
const BookCover = ({ title }) => {
  return (
    <div className="relative w-24 h-32 md:w-28 md:h-36 flex-shrink-0 perspective-[1000px] drop-shadow-md">
      {/* Book Spine */}
      <div className="absolute top-0 left-0 w-4 h-full bg-[#2E7D32] skew-y-[-15deg] origin-right z-0 rounded-l-md shadow-[inset_2px_0_4px_rgba(0,0,0,0.2)]"></div>
      
      {/* Book Front */}
      <div className="absolute top-0 left-4 w-[calc(100%-16px)] h-full bg-gradient-to-br from-[#388E3C] to-[#1B5E20] z-10 flex flex-col p-3 rounded-r-md shadow-inner border border-[#4CAF50] overflow-hidden">
        
        {/* Origami Mountain Decor */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-80 pointer-events-none">
          <div className="absolute bottom-0 left-[-10px] w-20 h-16 bg-[#FDFCF9] clip-path-polygon-[50%_0%,0%_100%,100%_100%] shadow-lg"></div>
          <div className="absolute bottom-[-10px] right-[-10px] w-24 h-20 bg-[#D5E2D1] clip-path-polygon-[50%_0%,0%_100%,100%_100%] shadow-md"></div>
          <div className="absolute bottom-2 left-6 w-12 h-10 bg-[#E8F5E9] clip-path-polygon-[50%_0%,0%_100%,100%_100%]"></div>
        </div>

        <h4 className="text-white font-bold text-[10px] md:text-xs leading-tight z-20 drop-shadow">
          {title.length > 25 ? title.substring(0, 25) + '...' : title}
        </h4>
        
      </div>
    </div>
  );
};

const CartItem = ({ item, itemIndex, onUpdateQty, onUpdateSides, onRemove }) => {
  const printingType = item.sideType === 'double' ? 'Double-sided' : 'Single-sided';
  const pricePerPage = item.pricePerPage ?? item.price ?? item.userPrice;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-b border-dashed border-[#D5E2D1] last:border-0">
      
      <BookCover title={item.title} />

      <div className="flex-1 space-y-2 w-full">
        <h3 className="text-lg md:text-xl font-bold text-[#1B5E20] leading-tight">
          {item.title}
        </h3>
        
        <div className="text-sm text-[#4A3B32] space-y-1">
          {item.code && <p><span className="font-medium opacity-80">Code:</span> {item.code}</p>}
          <p><span className="font-medium opacity-80">Printing:</span> {printingType}</p>
          <p><span className="font-medium opacity-80">Quality:</span> <span className="capitalize">{item.quality || 'Standard'}</span></p>
        </div>

        <div className="pt-1">
          {pricePerPage ? (
            <p className="text-lg text-[#388E3C] font-bold">₹{pricePerPage} <span className="text-sm font-medium text-[#4A3B32] opacity-80">per page</span></p>
          ) : (
            <p className="text-[#8D6E63] text-sm font-medium italic">Price pending admin review</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
        
        {/* Quantity Pill */}
        <div className="flex items-center bg-[#E8F5E9] rounded-full px-2 py-1 shadow-inner border border-[#D5E2D1]">
          <button
            onClick={() => onUpdateQty(itemIndex, Math.max(1, (item.qty || 1) - 1))}
            className="w-8 h-8 flex items-center justify-center text-[#2E7D32] hover:bg-[#C8E6C9] rounded-full transition-colors font-bold text-lg"
          >
            -
          </button>
          <span className="w-8 text-center text-[#1B5E20] font-bold text-lg">{item.qty || 1}</span>
          <button
            onClick={() => onUpdateQty(itemIndex, (item.qty || 1) + 1)}
            className="w-8 h-8 flex items-center justify-center text-[#2E7D32] hover:bg-[#C8E6C9] rounded-full transition-colors font-bold text-lg"
          >
            +
          </button>
        </div>

        {/* Trash Icon */}
        <button
          onClick={() => onRemove(itemIndex)}
          className="text-[#E53935] hover:text-[#C62828] transition-colors p-2 rounded-full hover:bg-[#FFEBEE]"
          title="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default CartItem;
