import React from 'react';

const CartItem = ({ item, itemIndex, onUpdateQty, onUpdateSides, onRemove }) => {
  const printingType = item.sideType === 'double' ? 'Double-sided' : 'Single-sided';
  const pricePerPage = item.pricePerPage ?? item.price ?? item.userPrice;

  return (
    <div className="flex justify-between items-center bg-white p-4 border-b">
      <div className="flex-1">
        <h3 className="font-semibold text-[#22c55e]">{item.title}</h3>
        {item.code && <p className="text-sm text-black">Code: {item.code}</p>}
        <p className="text-sm text-black">Printing: {printingType}</p>
        {pricePerPage ? (
          <p className="text-[#22c55e] font-bold">₹{pricePerPage} per page</p>
        ) : (
          <p className="text-black text-sm">Price pending admin review</p>
        )}
      </div>

      <div className="flex items-center gap-2 mx-4">
        <button
          onClick={() => onUpdateQty(itemIndex, Math.max(1, item.qty - 1))}
          className="bg-gray-200 px-2 py-1 rounded text-sm text-black"
        >
          -
        </button>
        <span className="px-3 text-black">{item.qty}</span>
        <button
          onClick={() => onUpdateQty(itemIndex, item.qty + 1)}
          className="bg-gray-200 px-2 py-1 rounded text-sm text-black"
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onRemove(itemIndex)}
          className="text-red-500 font-bold text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;
