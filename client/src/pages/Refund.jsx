import React, { useEffect } from 'react';

const Refund = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-emerald-700 font-medium mb-10 text-lg">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">01</span>
                Cancellation Policy
              </h2>
              <p>KampusKart believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
                <li>Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of printing them.</li>
                <li>KampusKart does not accept cancellation requests for items once they undergo the "Printing" phase since physical resources and consumables are allocated irrevocably.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">02</span>
                Refund Policy
              </h2>
              <p>We strive to deliver the highest quality prints. In case of any dissatisfaction, please refer to the following guidelines:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
                <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 2 days of receipt of the products.</li>
                <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 24 hours of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
                <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">03</span>
                Refund Processing Time
              </h2>
              <p>In case of any Refunds approved by the KampusKart management, it'll take 5-7 working days for the refund to be processed to the end customer. Refunds will be credited back to the original source of payment used during checkout.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Refund;
