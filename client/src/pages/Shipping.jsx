import React, { useEffect } from 'react';

const Shipping = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-emerald-700 font-medium mb-10 text-lg">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">01</span>
                Shipping Coverage
              </h2>
              <p>For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.</p>
              <p className="mt-3">However, KampusKart primarily operates as a hyperlocal service restricted to designated campus grounds and hostels. Pickup locations must be chosen at checkout.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">02</span>
                Shipping Timeline
              </h2>
              <p>Orders are dispatched within <strong>1-2 working days</strong> from the date of the order and/or payment confirmation. Alternatively, as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.</p>
              <p className="mt-3">KampusKart guarantees to hand over the consignment to the courier company or postal authorities within 1-2 working days from the date of the order and payment. Our minimum delivery timeline is <strong>1 working day</strong>, and our maximum delivery timeline is <strong>4 working days</strong>, depending on volume and operational hours.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">03</span>
                Liability
              </h2>
              <p>KampusKart is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 1-2 working days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">04</span>
                Delivery Address
              </h2>
              <p>Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on +91 90000 00000 or support.kampuskart.klu@gmail.com.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
