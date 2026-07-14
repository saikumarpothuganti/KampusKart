import React from 'react';
import { Link } from 'react-router-dom';
import ContactLinks from '../components/ContactLinks';
import PaperLeavesDivider from '../components/PaperLeavesDivider';
import BorderDecorations from '../components/BorderDecorations';
import TreeBranchDivider from '../components/TreeBranchDivider';
import ScrollRocket from '../components/ScrollRocket';
import PaperBirds from '../components/PaperBirds';
import { OrigamiText } from '../components/OrigamiFont';
import { OrigamiBook, OrigamiPlane, OrigamiTag, OrigamiPackage } from '../components/OrigamiIcons';
import homeBg from '../assets/HOME.png';
import footerImg from '../assets/footer.png';

const features = [
  {
    title: 'Workbooks',
    desc: 'Browse and order semester workbooks easily.',
    linkText: 'Explore Now →',
    to: '/workbook',
    icon: OrigamiBook
  },
  {
    title: 'Custom PDF Printing',
    desc: 'Upload your PDFs and get them printed with the best quality.',
    linkText: 'Upload Now →',
    to: '/custom-pdf',
    icon: OrigamiPackage
  },
  {
    title: 'Track Orders',
    desc: 'Track your orders in real-time from print to delivery.',
    linkText: 'Track Now →',
    to: '/order-history',
    icon: OrigamiPlane
  },
  {
    title: 'Best Prices',
    desc: 'Affordable pricing with the best quality guaranteed.',
    linkText: 'View Offers →',
    to: '/workbook',
    icon: OrigamiTag
  },
];

const testimonials = [
  {
    quote: 'The print quality is amazing and delivery is always on time. My go-to place every semester!',
    name: 'Ananya R.',
    course: 'CSE, 3rd Year',
  },
  {
    quote: 'Super easy to upload and order. KampusKart literally saves me so much time!',
    name: 'Vishal M.',
    course: 'ECE, 2nd Year',
  },
  {
    quote: 'Best prices and best support. Highly recommend to all KL students.',
    name: 'Sneha K.',
    course: 'Mech, 4th Year',
  },
];

const Home = () => {
  return (
    <div className="bg-paper text-ink min-h-screen relative font-sans">
      
      {/* Paper airplane scroll effect */}
      <ScrollRocket />
      
      {/* Hero Section */}
      <section 
        className="relative z-20 -mt-[76px] pt-[120px] pb-32 px-6 lg:px-12 bg-cover bg-center min-h-[100vh] flex items-center"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        <PaperLeavesDivider />
        <PaperBirds className="absolute top-0 left-0 w-full h-[150%] z-20 pointer-events-none overflow-visible" />
        
        {/* Softer overlay so the main image pops more */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper/70 via-paper/30 to-transparent pointer-events-none"></div>
        
        {/* Blur ONLY on the left side (fades out towards the right) */}
        <div className="absolute inset-0 backdrop-blur-sm [mask-image:linear-gradient(to_right,black_40%,transparent_70%)] pointer-events-none"></div>
        
        <div className="w-full pl-6 md:pl-16 lg:pl-24 relative z-[60] flex flex-col items-start pointer-events-auto">
          {/* Text Content */}
          <div className="w-full md:w-3/4 lg:w-1/2 space-y-6 relative pointer-events-auto">
            {/* Softer Glow Behind Text */}
            <div className="absolute inset-0 bg-paper/20 blur-[50px] z-[-1] -m-8 rounded-[100px] pointer-events-none"></div>
            
            <div className="inline-block mt-4">
               <OrigamiText text="Welcome To" className="text-xl md:text-2xl" />
            </div>
            
            <div className="-ml-3 py-2">
              <OrigamiText text="KAMPUSKART" className="text-3xl md:text-5xl lg:text-[65px]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mt-4 drop-shadow-[0_2px_4px_rgba(24,56,42,0.3)]">
              Where Every Semester Begins.
            </h2>
            
            <p className="text-lg font-medium text-ink max-w-md mt-6 font-sans drop-shadow-[0_1px_3px_rgba(24,56,42,0.3)]">
              Your one-stop place for workbooks, custom printing and delivery. made for students, by students.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6 relative z-50 pointer-events-auto mt-4">
              <Link
                to="/workbook"
                className="relative bg-gradient-to-br from-[#599A69] to-[#388E3C] text-[#FDFCF9] font-black py-4 px-8 rounded-tl-[24px] rounded-br-[24px] rounded-tr-md rounded-bl-md shadow-[4px_6px_15px_rgba(24,56,42,0.3)] hover:-translate-y-1 hover:shadow-[6px_8px_20px_rgba(24,56,42,0.4)] transition-all duration-300 flex items-center gap-3 border border-[#8FAD8C]/30"
              >
                <span className="text-2xl drop-shadow-md">📖</span> <span className="tracking-widest">BROWSE WORKBOOKS</span>
              </Link>
              <Link
                to="/custom-pdf"
                className="relative bg-gradient-to-br from-[#8FAD8C] to-[#599A69] text-[#1a3625] font-black py-4 px-8 rounded-tr-[24px] rounded-bl-[24px] rounded-tl-md rounded-br-md shadow-[4px_6px_15px_rgba(24,56,42,0.2)] hover:-translate-y-1 hover:shadow-[6px_8px_20px_rgba(24,56,42,0.3)] transition-all duration-300 flex items-center gap-3 border border-[#FDFCF9]/50"
              >
                <span className="text-2xl drop-shadow-md">📄</span> <span className="tracking-widest">UPLOAD PDF</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Border Decorations Container (Frames the features and testimonials, but skips the top hero) */}
      <div className="relative w-full z-30">
        <BorderDecorations />
        
        {/* Horizontal Divider 1 */}
        <TreeBranchDivider />

        {/* Features Section */}
        <div className="w-full relative z-10" style={{ borderTop: '2px dashed rgba(24, 56, 42, 0.2)' }}>
          <section id="services" className="pt-20 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-ink mb-4 flex items-center justify-center gap-4">
              <span className="text-green-700 text-2xl drop-shadow-sm">🌿</span>
              Everything you need, in one place
              <span className="text-green-700 text-2xl drop-shadow-sm">🌿</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-4">
              {features.map((feature, index) => {
                
                // Emulate the specific pins/clips from the user's image
                let clip;
                if (index === 0) {
                  clip = <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl drop-shadow-md z-10" style={{ filter: 'hue-rotate(240deg)' }}>📎</div>; // Greenish clip
                } else if (index === 2) {
                  clip = <div className="absolute -top-3 right-6 text-3xl drop-shadow-md z-10" style={{ transform: 'rotate(15deg)' }}>📌</div>; // Pin
                } else {
                  clip = <div className="absolute -top-5 right-6 text-4xl drop-shadow-md z-10" style={{ transform: 'rotate(10deg)', filter: 'sepia(1) hue-rotate(-50deg) saturate(3)' }}>📎</div>; // Copper clip
                }

                return (
                  <Link 
                    key={index} 
                    to={feature.to} 
                    className="realistic-paper-card p-8 flex flex-col items-center text-center h-full mt-4 cursor-pointer group"
                  >
                    
                    {clip}

                    <div className="mb-6 flex justify-center items-center w-full transform group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(feature.icon, { className: "w-20 h-20" })}
                    </div>
                    
                    <h3 className="text-lg font-serif font-bold text-paper mb-3">{feature.title}</h3>
                    <p className="text-paper/80 text-xs leading-relaxed flex-1 px-2">{feature.desc}</p>

                    {/* Subtle jagged/torn bottom edge texture overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjQiPjxwb2x5Z29uIHBvaW50cz0iMCw0IDQsMCA4LDQgOCw0IDAsNCIgZmlsbD0icmdiYSgwLDAsMCwwLjAzKSIvPjwvc3ZnPg==')] opacity-50"></div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Horizontal Divider 2 */}
        <TreeBranchDivider />

        {/* Testimonials Section */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-16 text-center relative z-10">
          <h3 className="text-2xl font-serif font-bold text-ink mb-16 flex items-center justify-center gap-3">
            <span className="text-ink-light">🍃</span> 
            Loved by students, for students 
            <span className="text-ink-light">🍃</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {testimonials.map((t, i) => (
              <Link to="/feedback" key={i} className="taped-paper p-8 text-left flex flex-col relative hover:scale-105 hover:-translate-y-1 transition-all"
                style={{
                  boxShadow: '6px 6px 0px #18382A',
                  border: '2px solid #18382A',
                  backgroundColor: '#FAF8F2',
                  transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})`
                }}
              >
                {/* Paper clip graphic */}
                <div className="absolute -top-4 right-4 w-8 h-12 border-2 border-green-800/30 rounded-full bg-transparent" style={{ transform: 'rotate(15deg)' }} />

                <div className="flex items-center gap-4 mb-4 border-b border-ink/10 pb-4">
                  <div className="w-12 h-12 rounded bg-ink/10 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <div className="text-green-600 text-xs mb-1">★★★★★</div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-ink/70">{t.course}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink/90 italic flex-1">
                  "{t.quote}"
                </p>
                <div className="text-right text-ink/30 mt-4">♡</div>
              </Link>
            ))}
          </div>
          
          {/* Trust Banner */}
          <div className="mt-20 flex justify-center">
            <div className="paper-ribbon px-8 py-3 flex items-center gap-2 text-sm font-bold text-ink">
              <span className="text-green-600">💚</span> 
              Thousands of students trust KampusKart every semester!
            </div>
          </div>
        </section>

        {/* Horizontal Divider 3 */}
        <TreeBranchDivider />
      </div> {/* End of BorderDecorations wrapper */}

      {/* Footer */}
        <footer 
          id="footer" 
          className="bg-ink text-paper relative overflow-hidden bg-cover bg-bottom pt-14 pb-12 sm:pb-24 lg:pb-32 px-6 lg:px-12"
          style={{ backgroundImage: `url(${footerImg})` }}
        >
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl border-2 border-paper/30 flex items-center justify-center">
                    <span className="font-serif font-black text-paper text-base">K</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-black text-paper leading-tight">KampusKart</h3>
                    <p className="text-[10px] uppercase tracking-widest text-paper/50 mt-0.5">Price • Track • Deliver</p>
                  </div>
                </div>
                <p className="text-sm text-paper/65 mb-6 leading-relaxed max-w-[220px]">
                  Your campus printing companion — fast, affordable workbook and PDF printing delivered right to you.
                </p>
              </div>

              {/* Navigate */}
              <div>
                <h4 className="text-[11px] font-black text-paper/50 uppercase tracking-[0.18em] mb-5">Navigate</h4>
                <ul className="space-y-3">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/workbook', label: 'Workbooks' },
                    { to: '/about', label: 'About Us' },
                    { to: '/order-history', label: 'Track Orders' },
                    { to: '/feedback', label: 'Feedback' },
                    { to: '/signin', label: 'Sign In' },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-sm text-paper/65 hover:text-paper transition flex items-center gap-2.5 group">
                        <span className="text-paper/25 text-xs group-hover:text-paper/60 transition">→</span>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[11px] font-black text-paper/50 uppercase tracking-[0.18em] mb-5">Contact Us</h4>
                <ul className="space-y-5">
                  <li>
                    <a href="https://www.instagram.com/kampuskart_?igsh=bG9oNTdvdW5ua2ky" target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-3 group hover:opacity-100 opacity-80 transition">
                      <span className="text-lg">📸</span>
                      <div>
                        <div className="text-sm font-bold text-paper group-hover:text-paper transition">Instagram</div>
                        <div className="text-xs text-paper/45 mt-0.5">@kampuskart_</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/KampusKart_Klu" target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-3 group hover:opacity-100 opacity-80 transition">
                      <span className="text-lg">✈️</span>
                      <div>
                        <div className="text-sm font-bold text-paper group-hover:text-paper transition">Telegram</div>
                        <div className="text-xs text-paper/45 mt-0.5">@KampusKart_Klu</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-paper/35 font-medium">© {new Date().getFullYear()} KampusKart. All rights reserved.</p>
              <p className="text-xs text-paper/35 font-medium">Made with 💚 for students across campuses.</p>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default Home;
