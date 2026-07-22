import React, { useState, useEffect, useRef } from 'react';
import API from '../lib/api';
import { Send, User, Trash2 } from 'lucide-react';

const AdminChats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await API.get('/chats/admin');
      setChats(res.data);
    } catch (err) {
      console.error('Error fetching admin chats:', err);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedChat = chats.find(c => c._id === selectedChatId);

  useEffect(() => {
    if (selectedChatId) {
      // Mark as read when selecting
      const markAsRead = async () => {
        try {
          await API.put(`/chats/admin/${selectedChatId}/read`);
          fetchChats();
        } catch(e) {
          console.error(e);
        }
      };
      markAsRead();
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;

    setLoading(true);
    try {
      await API.post(`/chats/admin/${selectedChatId}`, { text: replyText });
      setReplyText('');
      fetchChats();
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!selectedChatId) return;
    if (!window.confirm('Are you sure you want to clear this entire conversation? This action cannot be undone.')) return;
    
    try {
      await API.delete(`/chats/admin/${selectedChatId}`);
      fetchChats();
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  return (
    <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Sidebar: Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white font-bold text-gray-700">
          User Conversations
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm text-center">No active chats.</p>
          ) : (
            chats.map(chat => {
              const unreadCount = chat.messages.filter(m => m.sender === 'user' && !m.isRead).length;
              const isSelected = selectedChatId === chat._id;
              return (
                <div 
                  key={chat._id}
                  onClick={() => setSelectedChatId(chat._id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition flex items-center justify-between ${isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {chat.user?.picture ? (
                        <img src={chat.user.picture} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 truncate max-w-[150px]">{chat.user?.name || 'Unknown User'}</h4>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{chat.user?.email || ''}</p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white relative">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {selectedChat.user?.picture ? (
                    <img src={selectedChat.user.picture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedChat.user?.name}</h4>
                  <p className="text-xs text-gray-500">{selectedChat.user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleClearChat}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                title="Clear Chat History"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
              {selectedChat.messages.length === 0 && (
                <p className="text-center text-gray-400 mt-10">No messages yet.</p>
              )}
              {selectedChat.messages.map((msg, i) => (
                <div key={i} className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-primary text-white self-end rounded-br-none' : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-white/70 text-right' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <input 
                type="text" 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <button 
                type="submit"
                disabled={!replyText.trim() || loading}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Send <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircleIcon size={48} className="mb-4 opacity-50" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dummy icon for empty state
const MessageCircleIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);

export default AdminChats;
