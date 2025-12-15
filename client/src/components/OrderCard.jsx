import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';

const OrderCard = ({ order }) => {
  const firstItem = order.items[0];
  const moreCount = order.items.length - 1;

  const getStatusColor = (status) => {
    const colors = {
      pending_price: 'bg-orange-100 text-orange-800',
      sent: 'bg-yellow-100 text-yellow-800',
      placed: 'bg-blue-100 text-blue-800',
      printing: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <NavLink to={`/order-status/${order.orderId}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-bold text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-primary">{order.orderId}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {order.status === 'pending_price' ? 'Pending Price' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <p className="text-gray-700 mb-2">
          {firstItem.title}
          {moreCount > 0 && ` + ${moreCount} more`}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="font-bold text-lg text-primary">₹{order.amount}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default OrderCard;
