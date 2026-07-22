import React, { useState } from 'react';
import '../styles/CardAnimations.css';
import API from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CustomBookCard = ({ onAddToCart }) => {
  const { user, ordersEnabled } = useAuth();
  const [file, setFile] = useState(null);
  const [sides, setSides] = useState(1);
  const [quality, setQuality] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pauseMessage, setPauseMessage] = useState('');
  const abortControllerRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 25 * 1024 * 1024) {
      alert('File is larger than 25MB. Please upload a smaller PDF.');
      e.target.value = '';
      return;
    }
    setFile(selected);
  };

  const handleSubmitRequest = async () => {
    if (!user) {
      alert('Please sign in to upload a custom PDF request.');
      return;
    }
    
    if (!ordersEnabled) {
      if (!user.isAdmin) {
        alert(
          "We've received more orders than expected.\n" +
          "Orders are temporarily paused.\n" +
          "Please check back shortly or contact admin for urgent needs."
        );
        return;
      }
    }
    if (!file) {
      alert('Please upload a PDF');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('File is larger than 25MB. Please upload a smaller PDF.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const formData = new FormData();
      formData.append('pdf', file);

      console.log('Starting PDF upload:', { fileName: file.name, fileSize: file.size, qty: quantity, sides });

      const uploadRes = await API.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      console.log('Upload response:', uploadRes.data);

      // Create PDF request instead of adding to cart
      const requestPayload = {
        title: file.name.replace('.pdf', ''),
        pdfUrl: uploadRes.data.url,
        qty: quantity,
        sides,
        quality,
      };
      
      console.log('Creating PDF request:', requestPayload);
      
      const requestRes = await API.post('/pdf-requests', requestPayload);
      
      console.log('Request created:', requestRes.data);

      setFile(null);
      setSides(1);
      setQuality('standard');
      setQuantity(1);
      setUploadProgress(0);
      abortControllerRef.current = null;
      alert('PDF request submitted! Admin will set the price, and you can add it to cart from Orders and PDF Status.');
    } catch (error) {
      console.error('PDF submission error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        alert('Upload cancelled');
      } else if (error.response?.status === 413) {
        alert('File too large for upload. Maximum size is 25MB on free hosting.');
      } else {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to submit PDF request';
        alert(errorMsg);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div id="custom-upload-card" className="realistic-paper-card p-3 sm:p-4 flex flex-col h-full text-paper relative md:col-span-2 border-2 border-dashed border-[#B8860B] shadow-[0_0_15px_rgba(184,134,11,0.2)]">
      {/* Decorative Pin */}
      <div className="absolute -top-3 left-4 text-2xl drop-shadow-md z-10" style={{ transform: 'rotate(-10deg)' }}>📌</div>

      <h3 className="text-xl font-serif font-bold mb-4 drop-shadow-sm border-b border-[rgba(255,255,255,0.1)] pb-2 flex items-center gap-2">
        <span className="text-2xl filter saturate-150">📄</span> Custom PDF
      </h3>

      {pauseMessage && (
        <div className="mb-3 text-sm text-yellow-100 bg-yellow-900/30 border border-yellow-500/30 rounded-sm p-3 font-semibold shadow-inner">
          {pauseMessage}
        </div>
      )}

      <div className="mb-3 flex-1">
        <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Upload File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full border-2 border-[rgba(255,255,255,0.2)] rounded-sm px-3 py-2 text-ink bg-[#EDE0C8] font-semibold text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-bold file:bg-ink file:text-[#EDE0C8] hover:file:bg-[#25503C] shadow-inner"
        />
        {file && <p className="text-sm font-bold text-green-300 mt-2 tracking-wide drop-shadow-sm">✓ {file.name}</p>}
        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-[rgba(0,0,0,0.3)] rounded-full h-3 overflow-hidden shadow-inner border border-[rgba(255,255,255,0.1)]">
              <div
                className="bg-[#EDE0C8] h-3"
                style={{ width: `${uploadProgress}%`, transition: 'width 0.2s ease' }}
              />
            </div>
            <p className="text-xs font-bold text-paper mt-1 opacity-90 text-right">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>



      <div className="mb-3 p-3 rounded-sm bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.1)] text-xs font-semibold shadow-inner">
        Submit your PDF request. Admin will set the price, then you can add it to cart from Orders and PDF Status.
      </div>

      <div className="mb-3">
        <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Sides</label>
        <select
          value={sides}
          onChange={(e) => setSides(parseInt(e.target.value))}
          className="w-full border-2 border-[rgba(255,255,255,0.2)] rounded-sm px-3 py-2 text-sm text-ink font-bold bg-[#EDE0C8] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#EDE0C8]"
        >
          <option value={1}>Single-sided</option>
          <option value={2}>Double-sided</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Book Quality</label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setQuality('basic')}
              className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border ${
                quality === 'basic'
                  ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                  : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Basic
            </button>
            <button
              onClick={() => setQuality('standard')}
              className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border relative ${
                quality === 'standard'
                  ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                  : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Standard
              <span className="absolute -top-2 -right-1 text-[8px] bg-emerald-500 text-white px-1 rounded shadow">Rec.</span>
            </button>
            <button
              onClick={() => setQuality('premium')}
              className={`flex-1 py-1.5 rounded-sm text-xs font-bold transition border ${
                quality === 'premium'
                  ? 'bg-[#EDE0C8] text-ink border-[#EDE0C8] shadow-sm'
                  : 'bg-transparent text-paper border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Premium
            </button>
          </div>
          
          <div className="text-[10px] leading-relaxed p-2 bg-[rgba(0,0,0,0.2)] rounded border border-[rgba(255,255,255,0.05)]">
            {quality === 'basic' && (
              <ul className="list-disc pl-4 space-y-0.5">
                <li className="text-[#4ade80] font-bold">Affordable prices</li>
                <li>Classic binding with pins</li>
                <li>Smooth quality cover page</li>
                <li className="text-red-400 font-bold">* Please contact admin to view the different styles of books</li>
              </ul>
            )}
            {quality === 'standard' && (
              <ul className="list-disc pl-4 space-y-0.5">
                <li className="text-[#4ade80] font-bold">Regularly used and ordered books</li>
                <li>Smooth and quality cover page</li>
                <li>Standard binding with glue</li>
              </ul>
            )}
            {quality === 'premium' && (
              <ul className="list-disc pl-4 space-y-0.5">
                <li>High quality cover page</li>
                <li>Premium binding with glue</li>
                <li>Free transparent cover to protect the cover page of book</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-serif font-bold mb-2 opacity-90 uppercase tracking-widest">Quantity</label>
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm text-paper font-bold transition"
          >
            -
          </button>
            <span className="px-4 text-paper font-bold bg-[rgba(0,0,0,0.2)] py-1 rounded-sm shadow-inner">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm text-paper font-bold transition"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitRequest}
        disabled={uploading || (!ordersEnabled && (!user || !user.isAdmin))}
        className={`mt-auto mt-4 w-full border-2 text-sm py-2 rounded-sm font-bold transition hover:scale-[1.02] shadow-md ${
          (ordersEnabled || user?.isAdmin) ? 'bg-[#EDE0C8] text-ink border-[#D5CEBA] hover:bg-[#F5EBD6]' : 'bg-[rgba(255,255,255,0.1)] text-paper/50 border-transparent cursor-not-allowed shadow-none'
        }`}
      >
        {uploading ? 'Uploading...' : 'Submit Request'}
      </button>

      {uploading && (
        <button
          onClick={handleCancelUpload}
          className="w-full mt-2 bg-[rgba(0,0,0,0.3)] text-paper text-xs py-1.5 rounded-sm font-bold hover:bg-[rgba(0,0,0,0.5)] transition"
        >
          Cancel Upload
        </button>
      )}
    </div>
  );
};

export default CustomBookCard;
