import React, { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-emerald-700 font-medium mb-10 text-lg">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">01</span>
                Information Collection
              </h2>
              <p>KampusKart operates the kampuskart.online website, which provides the Service. This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</p>
              <p className="mt-3">If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">02</span>
                Document Privacy & Security
              </h2>
              <p>Documents uploaded for printing purposes are treated with the utmost confidentiality. We do not inspect, distribute, or retain your printed files post-delivery. They are transferred securely to our trusted print partners exclusively for fulfilling your specific order and are subsequently purged from our active processing servers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">03</span>
                Payment Data
              </h2>
              <p>We may provide paid products and/or services within the Service. In that case, we use third-party services for payment processing (e.g. payment processors). We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">04</span>
                Cookies
              </h2>
              <p>Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive. Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">05</span>
                Contact Us
              </h2>
              <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
              <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p><strong>Email:</strong> support@kampuskart.online</p>
                <p><strong>Phone:</strong> +91 90000 00000</p>
                <p><strong>Address:</strong> KampusKart Headquarters, KL University Area, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
