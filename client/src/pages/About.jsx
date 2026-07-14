import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TreeBranchDivider from '../components/TreeBranchDivider';
import workbookBg from '../assets/Workbook.png';
import footerImg from '../assets/footer.png';

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center justify-center gap-4 mb-10">
    <div className="h-px bg-ink/20 flex-1 max-w-[100px]" />
    <h2 className="text-3xl md:text-4xl font-serif font-black text-ink flex items-center gap-3 drop-shadow-sm">
      <span className="text-4xl filter saturate-150 drop-shadow-md">{icon}</span>
      {title}
    </h2>
    <div className="h-px bg-ink/20 flex-1 max-w-[100px]" />
  </div>
);

const ServiceCard = ({ icon, title, description, features }) => (
  <div className="realistic-paper-card p-8 flex flex-col h-full hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-paper">
    <div className="absolute -top-3 right-6 text-2xl drop-shadow-md z-10" style={{ transform: 'rotate(10deg)' }}>📌</div>
    <div className="w-16 h-16 rounded bg-paper/10 flex items-center justify-center text-3xl mb-6 shadow-inner border border-paper/20">
      {icon}
    </div>
    <h3 className="text-2xl font-serif font-bold text-paper mb-3">{title}</h3>
    <p className="text-paper/80 mb-6 italic flex-1">{description}</p>
    {features && (
      <ul className="space-y-2 mt-auto pt-4 border-t border-dashed border-paper/20">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-paper/90 font-medium">
            <span className="text-green-400 mt-0.5">✓</span> {f}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const About = () => {
  const { hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Background Image inside a fixed wrapper */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${workbookBg})` }}
      />
      <div className="absolute inset-0 bg-paper/95 z-0 backdrop-blur-[2px]"></div>
      
      <div className="max-w-6xl mx-auto py-12 px-4 relative z-10 text-ink font-sans">
        
        {/* Hero Section */}
        <div className="text-center mb-24 mt-8">
          <div className="inline-block px-4 py-1 bg-ink/5 border border-ink/10 rounded-full text-ink font-bold text-sm tracking-widest uppercase mb-6 shadow-inner">
            Welcome to KampusKart
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 text-paper" style={{ textShadow: '3px 3px 0px #112e1c, 6px 6px 0px rgba(17, 46, 28, 0.5)' }}>
            Where Every Semester Begins.
          </h1>
          <p className="text-xl md:text-2xl text-ink/90 max-w-3xl mx-auto font-medium italic mt-8 leading-relaxed">
            At KampusKart, we believe learning should be simple, affordable, and enjoyable.
            Find everything you need in one place—from semester workbooks to custom printing and real-time order tracking.
          </p>
          <div className="mt-8 font-serif font-bold text-ink drop-shadow-sm text-lg">
            — Built by students, for students. —
          </div>
        </div>

        {/* The Pledge / Mission */}
        <div className="taped-paper p-10 md:p-16 text-center max-w-4xl mx-auto mb-24 transform hover:scale-[1.01] transition-transform"
          style={{
            boxShadow: '8px 8px 0px #18382A',
            border: '2px solid #18382A',
            backgroundColor: '#FAF8F2'
          }}>
          <h2 className="text-sm font-bold tracking-widest uppercase text-green-700 mb-6">🌿 Our Mission & Pledge</h2>
          <p className="text-2xl md:text-3xl font-serif font-bold leading-relaxed text-ink drop-shadow-sm italic">
            "To make every student's academic journey easier by creating the absolute simplest platform for high-quality study materials, affordable printing, and fast campus delivery."
          </p>
        </div>

        <TreeBranchDivider />

        {/* Our Story */}
        <div className="my-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-sm font-bold tracking-widest uppercase text-green-700 mb-4">📖 Our Story</h2>
            <h3 className="text-4xl font-serif font-black mb-6 drop-shadow-sm">Every great semester starts with the right books.</h3>
            <div className="space-y-4 text-lg text-ink/80 leading-relaxed">
              <p>
                KampusKart began with a simple observation. Students were wasting hours searching for notes, workbooks, previous materials, and affordable printing services. 
              </p>
              <p>
                Orders were scattered across WhatsApp chats, files were lost, and deliveries were often delayed right when assignments were due.
              </p>
              <p className="font-bold text-ink">
                So we built a better way. A place where books, papers, and knowledge come together.
              </p>
              <p>
                Today, KampusKart helps students discover study materials, upload custom PDFs, print them professionally, and receive them directly on campus.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="realistic-paper-card w-full aspect-square max-w-md p-4 flex items-center justify-center transform rotate-2">
               <div className="w-full h-full bg-ink/5 border-2 border-dashed border-ink/20 flex flex-col items-center justify-center rounded-sm">
                 <span className="text-8xl filter saturate-150 drop-shadow-xl mb-4">📚</span>
                 <p className="font-serif font-bold text-xl italic text-ink/60">Knowledge Together</p>
               </div>
            </div>
          </div>
        </div>

        <TreeBranchDivider />

        {/* Services Section */}
        <div id="services" className="my-24 pt-8">
          <SectionHeader icon="✨" title="What We Offer" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon="📚"
              title="Semester Workbooks"
              description="Browse organized subject-wise workbooks for every semester."
              features={[
                "Professionally formatted",
                "High-quality printing",
                "Ready for campus delivery"
              ]}
            />
            <ServiceCard 
              icon="📄"
              title="Custom PDF Printing"
              description="Already have your own notes? Upload your PDFs and we'll print them."
              features={[
                "Single-sided & Double-sided",
                "Premium quality paper",
                "Bulk printing available"
              ]}
            />
            <ServiceCard 
              icon="🚚"
              title="Live Order Tracking"
              description="Know exactly where your order is at all times in real-time."
              features={[
                "Instant confirmation",
                "Printing & Packing updates",
                "Out for delivery alerts"
              ]}
            />
            <ServiceCard 
              icon="💰"
              title="Student-Friendly Pricing"
              description="Extremely affordable prices tailored specifically for student budgets."
              features={[
                "Transparent pricing",
                "No hidden charges",
                "Special semester discounts"
              ]}
            />
            <ServiceCard 
              icon="⚡"
              title="Fast Campus Delivery"
              description="Orders are delivered directly to your designated campus pickup locations."
              features={[
                "No waiting outside",
                "No confusion",
                "Simple & fast pickup"
              ]}
            />
            <ServiceCard 
              icon="❤️"
              title="Built For Students"
              description="We know the pressure of assignments, lab records, and deadlines."
              features={[
                "Secure Payments",
                "Dedicated Student Support",
                "Your academic companion"
              ]}
            />
          </div>
        </div>

        <TreeBranchDivider />

        {/* Powered By & Support */}
        <div className="my-24 bg-paper/70 backdrop-blur-md rounded-2xl p-12 border-2 border-dashed border-ink/30 shadow-inner text-center max-w-4xl mx-auto">
          <span className="text-6xl mb-6 block">🌱</span>
          <h2 className="text-3xl font-serif font-black mb-4">Powered by Codefora</h2>
          <p className="text-lg text-ink/80 mb-12 max-w-2xl mx-auto">
            KampusKart is proudly powered by Codefora. Together, we're building tools that make learning more collaborative, organized, and enjoyable for every student.
          </p>

          <h3 className="text-2xl font-serif font-bold mb-6">Need Help?</h3>
          <p className="text-ink/80 mb-8 italic">Whether you're ordering your first workbook or uploading a custom PDF, we're here to help.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white border-2 border-ink rounded-lg font-bold shadow-[4px_4px_0px_#112e1c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#112e1c] transition-all flex items-center gap-2">
              📧 Support Team
            </button>
            <button className="px-6 py-3 bg-white border-2 border-ink rounded-lg font-bold shadow-[4px_4px_0px_#112e1c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#112e1c] transition-all flex items-center gap-2">
              📱 Instagram
            </button>
            <button className="px-6 py-3 bg-white border-2 border-ink rounded-lg font-bold shadow-[4px_4px_0px_#112e1c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#112e1c] transition-all flex items-center gap-2">
              💬 Telegram
            </button>
            <button className="px-6 py-3 bg-white border-2 border-ink rounded-lg font-bold shadow-[4px_4px_0px_#112e1c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#112e1c] transition-all flex items-center gap-2">
              🟢 WhatsApp
            </button>
          </div>
        </div>

      </div>
      
      {/* Footer Image Banner */}
      <div 
        className="h-64 w-full bg-cover bg-bottom opacity-90 border-t-4 border-ink"
        style={{ backgroundImage: `url(${footerImg})` }}
      />
    </div>
  );
};

export default About;
