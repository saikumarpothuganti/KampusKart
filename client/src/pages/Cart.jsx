import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import NavLink from '../components/NavLink';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, fetchCart, updateItem, removeItem, getTotalPrice } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      fetchCart();
    }
  }, [user]);

  const handleUpdateQty = async (itemIndex, newQty) => {
    try {
      await updateItem(itemIndex, { qty: newQty });
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleUpdateSides = async (itemIndex, newSides) => {
    try {
      await updateItem(itemIndex, { sides: newSides });
    } catch (error) {
      alert('Failed to update sides');
    }
  };

  const handleRemove = async (itemIndex) => {
    try {
      await removeItem(itemIndex);
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const total = getTotalPrice();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-[#e5e7eb]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-6">🛒 Cart</h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[18px] p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <p className="text-white mb-4">Your cart is empty</p>
          <NavLink to="/workbook" className="text-[#22c55e] font-semibold hover:underline">
            Continue Shopping
          </NavLink>
        </div>
      ) : (
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[18px] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <div className="divide-y divide-[rgba(255,255,255,0.08)]">
            {cart.items.map((item, index) => (
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

          <div className="p-6 border-t border-[rgba(255,255,255,0.08)] bg-[#0f1116] rounded-b-[18px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-3xl font-bold text-[#22c55e]">₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-[#059669] to-[#047857] text-white py-3 rounded-full font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition text-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
