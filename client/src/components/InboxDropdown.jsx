import React, { useState, useEffect, useRef } from 'react';
import API from '../lib/api';

const InboxDropdown = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = messages.filter(m => !m.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await API.put('/messages/read-all');
      setMessages(messages.map(m => ({ ...m, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
      >
        {/* Inbox / Bell Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1f1f1f] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#252525]">
            <h3 className="font-bold text-white">Inbox</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>No messages yet.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg._id} 
                  onClick={() => !msg.read && handleMarkAsRead(msg._id)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${msg.read ? 'opacity-70 hover:bg-white/5' : 'bg-emerald-500/10 hover:bg-emerald-500/20'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-semibold text-sm ${msg.read ? 'text-gray-300' : 'text-white'}`}>
                      {msg.title}
                    </h4>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></span>
                    )}
                  </div>
                  <p className={`text-xs mb-2 ${msg.read ? 'text-gray-400' : 'text-gray-200'}`}>
                    {msg.body}
                  </p>
                  <p className="text-[10px] text-gray-500 text-right">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxDropdown;
