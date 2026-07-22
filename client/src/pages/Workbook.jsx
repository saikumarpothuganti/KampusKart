import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SubjectCard from '../components/SubjectCard';
import CustomBookCard from '../components/CustomBookCard';
import GlowAlert from '../components/GlowAlert';
import workbookBg from '../assets/Workbook.png';

const Workbook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, carts, createCart } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedItemForCart, setSelectedItemForCart] = useState(null);
  const [selectedCarts, setSelectedCarts] = useState([]);
  const [newCartName, setNewCartName] = useState('');

  const [year, setYear] = useState('1');
  const [sem, setSem] = useState('1');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const availableRef = useRef(null);
  const filtersRef = useRef(null);

  const ITEMS_PER_PAGE = 10; // 10 subjects + 1 custom card (spans 2) = 12 cols total (3 perfect rows on 4-column screen)

  // Auto-scroll removed as requested

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.get(`/subjects?year=${year}&sem=${sem}`);
      setSubjects(data);
      setShowSubjects(true);
      setQuery('');
      setCurrentPage(1);
      setTimeout(() => {
        if (availableRef.current) {
          const y = availableRef.current.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setAlertMessage('Failed to fetch subjects.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCartClick = (item) => {
    if (!user) {
      setAlertMessage('Please sign in to add items to your cart!');
      return;
    }
    
    if (!carts || carts.length === 0) {
      createCart('My Cart').then(newCarts => {
        addToCart(newCarts[0]._id, item).then(() => {
          setCartCount((c) => c + 1);
          setAlertMessage(`Added ${item.title} to new cart!`);
        });
      });
      return;
    }
    if (carts.length === 1) {
      addToCart(carts[0]._id, item).then(() => {
        setCartCount((c) => c + 1);
        setAlertMessage(`Added ${item.title} to ${carts[0].name}!`);
      }).catch((err) => {
        if (err.response?.status === 404) {
          setAlertMessage('Cart sync error. Please click Add to Cart again.');
        } else {
          setAlertMessage('Failed to add to cart. Please try again later.');
        }
      });
      return;
    }
    setSelectedItemForCart(item);
    setSelectedCarts([]);
    setShowCartModal(true);
  };

  const handleAddSelectedCarts = async () => {
    if (selectedCarts.length === 0) return;
    try {
      await Promise.all(selectedCarts.map(cartId => addToCart(cartId, selectedItemForCart)));
      setCartCount((c) => c + selectedCarts.length);
      setAlertMessage(`Added ${selectedItemForCart.title} to ${selectedCarts.length} cart(s)!`);
      setShowCartModal(false);
      setSelectedItemForCart(null);
      setSelectedCarts([]);
    } catch (e) {
      setAlertMessage('Failed to add to carts.');
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newCartName.trim()) return;
    try {
      const newCarts = await createCart(newCartName);
      const created = newCarts[newCarts.length - 1];
      await addToCart(created._id, selectedItemForCart);
      setCartCount((c) => c + 1);
      setAlertMessage(`Added ${selectedItemForCart.title} to ${newCartName}!`);
      setShowCartModal(false);
      setSelectedItemForCart(null);
      setNewCartName('');
    } catch (e) {
      setAlertMessage('Failed to create cart.');
    }
  };

  const filteredSubjects = useMemo(() => {
    let result = subjects;
    if (query.trim()) {
      result = subjects.filter((s) => {
        const q = query.trim().toLowerCase();
        const title = s.title?.toLowerCase() || '';
        const code = s.code?.toLowerCase() || '';
        if (q.length <= 3) {
          return title.startsWith(q) || code.startsWith(q);
        }
        return title.includes(q) || code.includes(q);
      });
    }
    
    // Sort by lowest available double-sided price
    return [...result].sort((a, b) => {
      const getPrice = (subj) => {
        if (subj.basic_doubleSidePrice !== undefined && subj.basic_doubleSidePrice !== null) {
          return subj.basic_doubleSidePrice;
        }
        if (subj.doubleSidePrice !== undefined && subj.doubleSidePrice !== null) {
          return subj.doubleSidePrice;
        }
        return Infinity;
      };
      return getPrice(a) - getPrice(b);
    });
  }, [subjects, query]);

  // Reset page to 1 when search query or subjects change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, subjects]);

  useEffect(() => {
    if (window.location.hash === '#custom-upload') {
      setTimeout(() => {
        const el = document.getElementById('custom-upload-card');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    let group = [1];
    if (start > 2) group.push('...');
    for (let i = start; i <= end; i++) group.push(i);
    if (end < totalPages - 1) group.push('...');
    group.push(totalPages);
    return group;
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed relative overflow-x-hidden"
      style={{ backgroundImage: `url(${workbookBg})` }}
    >
      {/* Giant Fixed Glowing Light to make content readable */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1400px] max-h-[1400px] bg-paper/80 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        .pulse-highlight {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

      <div className="max-w-[95%] xl:max-w-[98%] mx-auto py-8 px-2 md:px-6 text-ink font-sans relative z-10">
        
        <h1 className="text-4xl font-serif font-bold mb-8 inline-flex items-center gap-4 text-ink drop-shadow-sm bg-paper/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-ink/10">
          <span className="text-5xl filter saturate-150 drop-shadow-md">📚</span>
          Workbook Printing
        </h1>

        {/* Filters */}
        <div ref={filtersRef} className="realistic-paper-card p-8 mb-12">
          {/* Clip for the card */}
          <div className="absolute -top-4 right-8 text-3xl drop-shadow-md z-10" style={{ transform: 'rotate(10deg)' }}>📌</div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div>
              <label className="block text-sm font-serif font-bold text-paper mb-2 uppercase tracking-widest">Select Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#EAD1A6] border-2 border-[rgba(255,255,255,0.2)] text-ink font-bold rounded px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-paper"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-serif font-bold text-paper mb-2 uppercase tracking-widest">Select Semester</label>
              <select
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                className="w-full bg-[#EAD1A6] border-2 border-[rgba(255,255,255,0.2)] text-ink font-bold rounded px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-paper"
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#EDE0C8] border-2 border-[rgba(255,255,255,0.2)] text-ink shadow-[4px_4px_0px_rgba(24,56,42,0.8)] hover:bg-[#F5EBD6] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(24,56,42,0.8)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all w-full py-3 text-lg font-serif font-bold h-[52px] rounded-sm"
              >
                {loading ? 'Searching...' : 'Find Subjects'}
              </button>
            </div>
          </form>
        </div>

        {/* Unified Print Materials Section */}
        <div className="mb-12">
          {/* Custom PDF Upload Mobile Only (Above Heading) */}
          <div className="block sm:hidden mb-6">
            {currentPage === 1 && <CustomBookCard onAddToCart={handleAddToCartClick} />}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b-2 border-ink/10 gap-4">
            <div className="flex items-center gap-3">
              <h2 ref={availableRef} className="text-3xl font-serif font-bold text-ink drop-shadow-sm bg-paper/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-ink/10">Print Materials</h2>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-ink text-paper text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  {cartCount} in Cart
                </span>
              )}
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!showSubjects}
              placeholder={showSubjects ? 'Search subjects...' : 'Search enabled after Find'}
              className={`w-full md:w-[26rem] lg:w-[32rem] bg-paper/95 backdrop-blur-sm border-2 border-ink/30 text-ink font-serif font-bold rounded-sm px-4 py-2 shadow-[2px_2px_0px_#112e1c] focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] focus:shadow-[1px_1px_0px_#B8860B] placeholder:text-ink/40 transition-all ${
                showSubjects ? 'opacity-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#112e1c]' : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          {!showSubjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <div className="hidden sm:block sm:col-span-1 md:col-span-2 h-full">
                <CustomBookCard onAddToCart={handleAddToCartClick} />
              </div>
              <div className="bg-paper/70 backdrop-blur-md rounded-md p-12 flex flex-col items-center justify-center col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2 border-2 border-dashed border-ink/30 shadow-inner">
                 <p className="text-ink font-serif font-bold text-xl italic text-center drop-shadow-sm">Select your year and semester above to find subjects!</p>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <div className="hidden sm:block sm:col-span-1 md:col-span-2 h-full">
                <CustomBookCard onAddToCart={handleAddToCartClick} />
              </div>
              <div className="realistic-paper-card p-6 text-paper flex flex-col justify-center gap-2 col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-3">
                <p className="font-bold text-xl drop-shadow-md">No subjects found for this selection</p>
                <p className="text-base opacity-90">However, you can use the <strong>Custom PDF</strong> form to upload exactly what you need!</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                
                {/* The Custom Upload Card is always the first item in the grid on desktop! */}
                {currentPage === 1 && (
                  <div className="hidden sm:block sm:col-span-1 md:col-span-2 h-full">
                    <CustomBookCard onAddToCart={handleAddToCartClick} />
                  </div>
                )}
                
                {/* The subject cards fill the rest of the grid seamlessly! */}
                {paginatedSubjects.length > 0 ? (
                  paginatedSubjects.map((s) => (
                    <SubjectCard key={s._id} subject={s} onAddToCart={handleAddToCartClick} />
                  ))
                ) : (
                  currentPage === 1 && (
                    <div className="bg-paper/70 backdrop-blur-md rounded-md p-12 col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2 flex items-center justify-center border-2 border-dashed border-ink/30 shadow-inner">
                      <p className="text-ink font-serif font-bold text-2xl italic drop-shadow-sm">No files match your search.</p>
                    </div>
                  )
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center bg-[#EDE0C8] border-2 border-[rgba(255,255,255,0.2)] text-ink font-bold rounded-sm shadow-[2px_2px_0px_#18382A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#18382A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    &lt;
                  </button>
                  
                  {getPaginationGroup().map((item, index) => {
                    if (item === '...') {
                      return <span key={`ellipsis-${index}`} className="px-2 font-bold opacity-50 text-ink">...</span>;
                    }
                    return (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`w-10 h-10 flex items-center justify-center font-bold rounded-sm transition-all ${
                          currentPage === item 
                            ? 'bg-ink text-[#EDE0C8] shadow-inner border-2 border-ink' 
                            : 'bg-[#EDE0C8] border-2 border-[rgba(255,255,255,0.2)] text-ink shadow-[2px_2px_0px_#18382A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#18382A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center bg-[#EDE0C8] border-2 border-[rgba(255,255,255,0.2)] text-ink font-bold rounded-sm shadow-[2px_2px_0px_#18382A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#18382A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Overlay */}
      {alertMessage && (
        <GlowAlert 
          message={alertMessage} 
          okText={alertMessage === 'Please sign in to add items to your cart!' ? 'Continue to Sign In' : 'OK'}
          onClose={() => {
            if (alertMessage === 'Please sign in to add items to your cart!') {
              navigate('/signin');
            }
            setAlertMessage('');
          }}
          onCancel={alertMessage === 'Please sign in to add items to your cart!' ? () => setAlertMessage('') : undefined}
        />
      )}

      {/* Cart Selection Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="realistic-paper-card w-full max-w-md p-8 relative transform rotate-1 shadow-2xl">
            {/* Fold effect corner */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-ink/20 shadow-sm rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
            
            <button onClick={() => setShowCartModal(false)} className="absolute top-4 right-4 text-[#B8860B]/60 hover:text-[#B8860B] text-xl font-bold font-serif hover:scale-110 transition-transform">
              ✕
            </button>
            <h3 className="text-2xl font-bold font-serif text-[#B8860B] mb-2">Select a Cart</h3>
            <p className="text-[#B8860B]/80 text-sm mb-6 font-serif">Which cart would you like to add <span className="font-bold text-[#B8860B] italic">{selectedItemForCart?.title}</span> to?</p>
            
            <div className="space-y-3 max-h-56 overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {carts.map(c => {
                const isSelected = selectedCarts.includes(c._id);
                return (
                  <label
                    key={c._id}
                    className={`w-full flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                      isSelected 
                        ? 'border-[#C09A3F] bg-gradient-to-r from-[#C5A059] to-[#B8860B] shadow-[0_4px_15px_rgba(184,134,11,0.4)] transform -translate-y-1' 
                        : 'border-2 border-dashed border-[#B8860B]/40 hover:border-[#B8860B] hover:bg-[#B8860B]/5'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCarts([...selectedCarts, c._id]);
                        else setSelectedCarts(selectedCarts.filter(id => id !== c._id));
                      }}
                      className="w-5 h-5 accent-[#1a422a] rounded cursor-pointer"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className={`font-serif font-bold transition-transform origin-left ${isSelected ? 'text-[#FAF8F2] drop-shadow-md' : 'text-[#B8860B]'}`}>{c.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-sm font-bold shadow-inner ${isSelected ? 'text-[#B8860B] bg-[#FAF8F2]' : 'text-[#FAF8F2] bg-[#B8860B] shadow-[2px_2px_0px_rgba(184,134,11,0.3)]'}`}>{c.items?.length || 0} items</span>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <button
              onClick={handleAddSelectedCarts}
              disabled={selectedCarts.length === 0}
              className="w-full mb-6 bg-[#B8860B] text-[#FAF8F2] px-4 py-3 rounded-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] disabled:opacity-50 transition-all font-serif flex items-center justify-center gap-2"
            >
              Add to Selected Carts ({selectedCarts.length})
            </button>

            <div className="border-t-2 border-dashed border-[#B8860B]/30 pt-5 mt-2">
              <p className="text-xs font-bold text-[#B8860B]/70 uppercase tracking-wider mb-3 font-serif">Or scribe a new cart</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Project Print..." 
                  className="flex-1 bg-[#FAF8F2] border-2 border-dashed border-[#B8860B] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 font-serif text-[#1a422a] placeholder:text-[#1a422a]/50 transition-all shadow-inner"
                  value={newCartName}
                  onChange={(e) => setNewCartName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
                />
                <button 
                  onClick={handleCreateAndAdd}
                  disabled={!newCartName.trim()}
                  className="bg-[#B8860B] text-[#FAF8F2] px-4 py-2 rounded-sm text-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] disabled:opacity-50 transition-all font-serif"
                >
                  Create & Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workbook;
