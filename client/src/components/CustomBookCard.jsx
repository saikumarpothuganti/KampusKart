import React, { useState } from 'react';
import '../styles/CardAnimations.css';
import API from '../lib/api';

const CustomBookCard = ({ onAddToCart }) => {
  const [file, setFile] = useState(null);
  const [sides, setSides] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitRequest = async () => {
    if (!file) {
      alert('Please upload a PDF');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('pdf', file);

      const uploadRes = await API.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Create PDF request instead of adding to cart
      await API.post('/pdf-requests', {
        title: file.name.replace('.pdf', ''),
        pdfUrl: uploadRes.data.url,
        qty: quantity,
        sides,
      });

      setFile(null);
      setSides(1);
      setQuantity(1);
      alert('PDF request submitted! Admin will set the price, and you can add it to cart from Orders and PDF Status.');
    } catch (error) {
      alert('Failed to submit PDF request');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1f1f1f] rounded-2xl shadow-md p-4 pb-6 h-[440px] flex flex-col transition-transform duration-150 ease-out hover:scale-[1.02] hover:shadow-lg card-glow-border">
      <h3 className="text-lg font-semibold mb-4 text-white">📄 Upload Custom PDF</h3>

      <div className="mb-3 flex-1">
        <label className="block text-sm font-medium mb-2 text-white">Upload PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full border rounded px-3 py-2 text-black bg-white"
        />
        {file && <p className="text-sm text-green-400 mt-1">Selected: {file.name}</p>}
      </div>

      <div className="mb-3 p-3 rounded bg-[#2a2a2a] border border-emerald-700 text-sm text-gray-200">
        Submit your PDF request. Admin will set the price, then you can add it to cart from Orders and PDF Status.
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium mb-2 text-white">Sides</label>
        <select
          value={sides}
          onChange={(e) => setSides(parseInt(e.target.value))}
          className="w-full border rounded px-2.5 py-2 text-sm text-black bg-white"
        >
          <option value={1}>Single-sided</option>
          <option value={2}>Double-sided</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium mb-2 text-white">Quantity</label>
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-200 px-2.5 py-1 rounded text-black text-sm"
          >
            -
          </button>
            <span className="px-3 text-white text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-200 px-2.5 py-1 rounded text-black text-sm"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitRequest}
        disabled={uploading}
        className="mt-auto mt-4 mb-3 w-full bg-primary text-white text-sm py-1.5 rounded-md font-semibold hover:bg-secondary disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {uploading ? 'Uploading...' : 'Submit Request'}
      </button>
    </div>
  );
};

export default CustomBookCard;
