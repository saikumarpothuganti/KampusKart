import React from 'react';

const CartItem = ({ item, itemIndex, onUpdateQty, onUpdateSides, onRemove }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 border-b">
      <div className="flex-1">
        <h3 className="font-semibold text-[#22c55e]">{item.title}</h3>
        {item.code && <p className="text-sm text-black">Code: {item.code}</p>}
        <p className="text-sm text-black">Sides: {item.sides}</p>
        {item.userPrice ?? item.price ? (
          <p className="text-[#22c55e] font-bold">₹{item.userPrice ?? item.price}</p>
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
        <select
          value={item.sides}
          onChange={(e) => onUpdateSides(itemIndex, parseInt(e.target.value))}
          className="border rounded px-2 py-1 text-sm text-black"
        >
          <option value={1}>1-sided</option>
          <option value={2}>2-sided</option>
        </select>
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
