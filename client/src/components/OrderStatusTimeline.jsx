import React from 'react';

const OrderStatusTimeline = ({ status }) => {
  const steps = ['sent', 'placed', 'printing', 'out_for_delivery', 'delivered'];
  const stepLabels = {
    sent: 'Sent',
    placed: 'Order Placed',
    printing: 'Printing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
  };

  const statusToIndex = {
    pending_price: 0,
    sent: 0,
    placed: 1,
    printing: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  const currentIndex = statusToIndex[status] ?? 0;
  const progressPercentage = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="my-6">
      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full bg-gradient-to-r from-[#22c55e] to-[#10b981] rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercentage}%`,
              minWidth: progressPercentage > 0 ? '8%' : '0%',
              boxShadow: '0 0 26px rgba(34, 197, 94, 0.7), 0 0 46px rgba(34, 197, 94, 0.45)'
            }}
          >
            <div
              className="progress-shine"
              style={{ animationPlayState: progressPercentage === 100 ? 'paused' : 'running' }}
            />
          </div>
        </div>
        <p className="text-sm text-center mt-2 font-semibold text-[#22c55e]">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>

      {/* Steps */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                index <= currentIndex 
                  ? 'bg-[#22c55e] shadow-lg shadow-[#22c55e]/50 scale-110' 
                  : 'bg-gray-300'
              }`}
            >
              {index + 1}
            </div>
            <p className={`text-sm mt-2 text-center font-medium ${
              index <= currentIndex ? 'text-[#22c55e]' : 'text-gray-500'
            }`}>
              {stepLabels[step]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
