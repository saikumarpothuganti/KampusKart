import React, { useState } from 'react';
import API from '../lib/api';
import { useCart } from '../context/CartContext';
import SubjectCard from '../components/SubjectCard';
import CustomBookCard from '../components/CustomBookCard';
import GlowAlert from '../components/GlowAlert';

const Workbook = () => {
  const { addToCart } = useCart();

  const [year, setYear] = useState('1');
  const [sem, setSem] = useState('1');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.get(`/subjects?year=${year}&sem=${sem}`);
      setSubjects(res.data || []);
      setShowSubjects(true);
    } catch (err) {
      console.error('Failed to load subjects', err);
      setSubjects([]);
      setShowSubjects(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);
      setCartCount((c) => c + 1);
      setAlertMessage('Added to cart');
    } catch (error) {
      // Silently fail - no alert for unavailable subjects
      console.error('Failed to add to cart:', error);
    }
  };

  const filteredSubjects = !showSubjects || !query
    ? subjects
    : subjects.filter((s) => {
        const q = query.trim().toLowerCase();
        const title = s.title?.toLowerCase() || '';
        const code = s.code?.toLowerCase() || '';
        if (q.length <= 3) {
          return title.startsWith(q) || code.startsWith(q);
        }
        return title.includes(q) || code.includes(q);
      });

  return (
    <>
    <div className="max-w-7xl mx-auto py-8 px-4 text-[#e5e7eb]">
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8">📚 Workbook Printing</h1>

      {/* Filters */}
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.12)] rounded-[18px] p-6 mb-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#9ca3af] mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-3 py-2"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#9ca3af] mb-2">Semester</label>
            <select
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              className="w-full bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-3 py-2"
            >
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#059669] to-[#047857] text-white py-3 rounded-full font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition"
            >
              {loading ? 'Loading...' : 'Show Subjects'}
            </button>
          </div>
        </form>
      </div>

      {/* Upload + Subjects - Mixed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max">
        {/* Left: Custom Card */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upload Your Own Materials</h2>
          <CustomBookCard onAddToCart={handleAddToCart} />
        </div>

        {/* Right: Subjects (spans 2 columns) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">Available Subjects</h2>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!showSubjects}
              placeholder={showSubjects ? 'Search by title or code...' : 'Search enabled after Show Subjects'}
              className={`w-64 bg-[#0f1116] border border-[rgba(255,255,255,0.12)] text-[#e5e7eb] rounded-xl px-3 py-2 ${
                showSubjects ? 'opacity-100' : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          {!showSubjects ? (
            <p className="text-[#9ca3af]">Select year and semester, then click Show Subjects.</p>
          ) : subjects.length === 0 ? (
            <p className="text-[#9ca3af]">No subjects available for this selection.</p>
          ) : filteredSubjects.length === 0 ? (
            <p className="text-[#9ca3af]">No files found for your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject._id} subject={subject} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    <GlowAlert
      message={alertMessage}
      onClose={() => setAlertMessage('')}
      okText="OK"
      variant="success"
    />
    </>
  );
};

export default Workbook;
