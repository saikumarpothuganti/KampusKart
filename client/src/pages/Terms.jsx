import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-emerald-700 font-medium mb-10 text-lg">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">01</span>
                Introduction
              </h2>
              <p>Welcome to KampusKart ("Company", "we", "our", "us"). These Terms and Conditions govern your use of our website located at kampuskart.online (together or individually "Service") operated by KampusKart.</p>
              <p className="mt-3">Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound of them.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">02</span>
                Purchases and Payment
              </h2>
              <p>If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>
              <p className="mt-3">You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">03</span>
                Content Rights
              </h2>
              <p>Users are strictly prohibited from uploading, printing, or distributing content that infringes upon the copyrights, trademarks, or intellectual property rights of any third party. KampusKart reserves the right to cancel any printing order that violates institutional academic integrity policies or local laws.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">04</span>
                Prohibited Uses
              </h2>
              <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">05</span>
                Limitation Of Liability
              </h2>
              <p>Except as prohibited by law, you will hold us and our officers, directors, employees, and agents harmless for any indirect, punitive, special, incidental, or consequential damage, however it arises (including attorneys' fees and all related costs and expenses of litigation and arbitration), whether in an action of contract, negligence, or other tortious action, or arising out of or in connection with this agreement.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
