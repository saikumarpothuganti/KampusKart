import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import { useNavigate } from 'react-router-dom';

const FloatingChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [toastMessage, setToastMessage] = useState('');
  const previousUnreadCount = useRef(0);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    if (user && !sessionStorage.getItem('chatWelcomeShown')) {
      const timer = setTimeout(() => {
        if (!isOpenRef.current) {
          setToastMessage("Hey there! If you have any queries, please message here. We reply.");
          setTimeout(() => setToastMessage(''), 8000);
        }
        sessionStorage.setItem('chatWelcomeShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    // Mark as read if opened while there are unread messages
    if (isOpen && chat) {
      const hasUnread = chat.messages?.some(m => m.sender === 'admin' && !m.isRead);
      if (hasUnread) {
        API.put('/chats/read').then(() => fetchChat());
      }
    }
  }, [isOpen]);

  const fetchChat = async () => {
    if (!user) return;
    try {
      const res = await API.get('/chats');
      setChat(res.data);
      
      const unreadCount = res.data.messages?.filter(m => m.sender === 'admin' && !m.isRead).length || 0;
      
      // If we have new unread messages and chat is closed, show toast
      if (unreadCount > previousUnreadCount.current && !isOpenRef.current) {
        setToastMessage("New message from Support!");
        setTimeout(() => setToastMessage(''), 5000);
      }
      
      previousUnreadCount.current = unreadCount;

      // Mark messages as read if chat is currently open
      if (isOpenRef.current && unreadCount > 0) {
        await API.put('/chats/read');
        const updatedRes = await API.get('/chats');
        setChat(updatedRes.data);
        previousUnreadCount.current = 0; // reset since we marked as read
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  useEffect(() => {
    let interval;
    if (user) {
      fetchChat();
      interval = setInterval(fetchChat, 5000);
    }
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await API.post('/chats', { text: message });
      setChat(res.data);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = async (text) => {
    setLoading(true);
    try {
      const res = await API.post('/chats', { text });
      setChat(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasUnreadMessages = chat?.messages?.some(m => m.sender === 'admin' && !m.isRead);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#1a324b] rounded-xl shadow-[0_0_25px_rgba(77,168,218,0.3)] border border-[#4da8da]/30 overflow-hidden flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-[#14263a] p-4 border-b border-[#4da8da]/30 flex justify-between items-center relative overflow-hidden">
            <div className="shine-overlay"></div>
            <h3 className="text-white font-bold tracking-wide relative z-10">KampusKart Support</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#4da8da] hover:text-white transition relative z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#1a324b]">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-white/70">
                <MessageCircle size={48} className="opacity-50 text-[#4da8da]" />
                <p>Sign in to start chatting with us!</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/signin');
                  }}
                  className="flex items-center gap-2 bg-[#4da8da] text-white px-6 py-2 rounded-sm font-bold shadow-md hover:bg-[#3b8dbd] transition"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              </div>
            ) : (
              <>
                {chat?.messages?.length === 0 && (
                  <p className="text-center text-white/50 mt-10 text-sm">Send us a message and we'll reply as soon as possible.</p>
                )}
                {chat?.messages?.map((msg, i) => (
                  <div key={i} className={`max-w-[80%] rounded-lg p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#4da8da] text-white self-end' : 'bg-[#14263a] text-white self-start border border-[#4da8da]/20'}`}>
                    <p>{msg.text}</p>
                    <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-white/80 text-right' : 'text-white/40'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* Quick Replies */}
                <div className="flex flex-wrap gap-2 mt-4 pb-2">
                  {[
                    "Will my prices be reduced when ordered in bulk?",
                    "Can you reduce the price on a pricey book?",
                    "How long does delivery take?",
                    "How do I track my order?"
                  ].map((qr, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleQuickReply(qr)}
                      disabled={loading}
                      className="bg-[#14263a] text-[#4da8da] text-xs px-3 py-1.5 rounded-full border border-[#4da8da]/30 hover:bg-[#1a324b] hover:border-[#4da8da] transition disabled:opacity-50 text-left shadow-sm"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Input Area */}
          {user && (
            <form onSubmit={sendMessage} className="p-3 bg-[#14263a] border-t border-[#4da8da]/30 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#1a324b] text-white placeholder:text-white/40 text-sm rounded-md px-3 py-2 outline-none border border-transparent focus:border-[#4da8da]/50 transition shadow-inner"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="bg-[#4da8da] text-white p-2 rounded-md hover:bg-[#3b8dbd] transition disabled:opacity-50 flex items-center justify-center shadow-md"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && !isOpen && (
        <div className="absolute bottom-20 right-0 w-64 bg-[#14263a] text-white font-semibold text-sm px-4 py-3 rounded-lg shadow-[0_0_15px_rgba(77,168,218,0.4)] border border-[#4da8da]/50 flex items-start gap-2 animate-bounce">
          <MessageCircle size={20} className="text-[#4da8da] flex-shrink-0 mt-0.5" />
          <span className="flex-1 leading-tight">{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-white/50 hover:text-white flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`bg-[#4da8da] text-white p-4 rounded-full shadow-[0_0_20px_rgba(77,168,218,0.5)] hover:shadow-[0_0_25px_rgba(77,168,218,0.8)] border border-[#4da8da]/50 transition-all duration-300 hover:scale-105 flex items-center justify-center ${isOpen ? 'rotate-90 scale-90 opacity-0 pointer-events-none absolute' : ''}`}
        style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <MessageCircle size={28} />
        {hasUnreadMessages && !isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-[#14263a] rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
