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

const CartItemRow = ({ item, qty, isDiscounted, price, originalPrice, hideActions, onUpdateQty, onRemove, itemIndex, totalItemQty }) => {
  const printingType = item.sideType === 'double' ? 'Double-sided' : 'Single-sided';
  
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-b border-dashed border-[#D5E2D1] last:border-0 rounded-lg p-4 transition-all duration-300 ${isDiscounted ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-[1.01]' : ''}`}>
      
      <BookCover title={item.title} />

      <div className="flex-1 space-y-2 w-full">
        {isDiscounted && <div className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1"><span className="animate-pulse">✨</span> Token Applied to this Item</div>}
        <h3 className={`text-lg md:text-xl font-bold leading-tight ${isDiscounted ? 'text-yellow-800' : 'text-[#1B5E20]'}`}>
          {item.title}
        </h3>
        
        <div className="text-sm text-[#4A3B32] space-y-1">
          {item.code && <p><span className="font-medium opacity-80">Code:</span> {item.code}</p>}
          <p><span className="font-medium opacity-80">Printing:</span> {printingType}</p>
          <p><span className="font-medium opacity-80">Quality:</span> <span className="capitalize">{item.quality || 'Standard'}</span></p>
        </div>

        <div className="pt-1">
          {originalPrice ? (
            isDiscounted ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400 font-bold line-through decoration-red-500">₹{originalPrice}</p>
                <p className="text-xl text-yellow-700 font-black drop-shadow-sm">₹{price} <span className="text-xs font-medium text-yellow-600 opacity-80">per book</span></p>
              </div>
            ) : (
              <p className="text-lg text-[#388E3C] font-bold">₹{price} <span className="text-sm font-medium text-[#4A3B32] opacity-80">per book</span></p>
            )
          ) : (
            <p className="text-[#8D6E63] text-sm font-medium italic">Price pending admin review</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
        {hideActions ? (
          <div className="text-xs font-bold text-yellow-700/60 uppercase tracking-widest px-2 py-1 bg-yellow-100/50 rounded-md border border-yellow-200">
            Qty: {qty} (Locked)
          </div>
        ) : (
          <>
            {/* Quantity Pill */}
            <div className="flex items-center bg-[#E8F5E9] rounded-full px-2 py-1 shadow-inner border border-[#D5E2D1]">
              <button
                onClick={() => onUpdateQty(itemIndex, Math.max(1, totalItemQty - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#2E7D32] hover:bg-[#C8E6C9] rounded-full transition-colors font-bold text-lg"
              >
                -
              </button>
              <span className="w-8 text-center text-[#1B5E20] font-bold text-lg">{qty}</span>
              <button
                onClick={() => onUpdateQty(itemIndex, totalItemQty + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#2E7D32] hover:bg-[#C8E6C9] rounded-full transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>

            {/* Trash Icon */}
            <button
              onClick={() => {
                if (totalItemQty > qty) {
                  // This is the regular row of a split item. Trash should just remove the regular items, leaving the 1 gold item.
                  onUpdateQty(itemIndex, 1);
                } else {
                  onRemove(itemIndex);
                }
              }}
              className="text-[#E53935] hover:text-[#C62828] transition-colors p-2 rounded-full hover:bg-[#FFEBEE]"
              title="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ item, itemIndex, onUpdateQty, onUpdateSides, onRemove, isDiscounted, discountAmount }) => {
  const originalPrice = item.pricePerPage ?? item.price ?? item.userPrice;
  const newPrice = isDiscounted ? Math.max(0, originalPrice - discountAmount) : originalPrice;
  const totalItemQty = item.qty || 1;

  if (isDiscounted && totalItemQty > 1) {
    return (
      <div className="flex flex-col gap-2">
        {/* Discounted Unit */}
        <CartItemRow 
          item={item} 
          qty={1} 
          isDiscounted={true} 
          price={newPrice} 
          originalPrice={originalPrice} 
          hideActions={true} 
        />
        {/* Remaining Regular Units */}
        <CartItemRow 
          item={item} 
          qty={totalItemQty - 1} 
          isDiscounted={false} 
          price={originalPrice} 
          originalPrice={originalPrice} 
          hideActions={false} 
          onUpdateQty={onUpdateQty} 
          onRemove={onRemove} 
          itemIndex={itemIndex}
          totalItemQty={totalItemQty}
        />
      </div>
    );
  }

  return (
    <CartItemRow 
      item={item} 
      qty={totalItemQty} 
      isDiscounted={isDiscounted} 
      price={newPrice} 
      originalPrice={originalPrice} 
      hideActions={false} 
      onUpdateQty={onUpdateQty} 
      onRemove={onRemove} 
      itemIndex={itemIndex}
      totalItemQty={totalItemQty}
    />
  );
};

export default CartItem;
