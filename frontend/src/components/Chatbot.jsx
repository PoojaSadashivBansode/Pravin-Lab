import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import logo from "../assets/Logo1.png"; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNote, setShowNote] = useState(true); 
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to Pravin Lab. How can I assist you with your health tests today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Logic to make the note reappear after 60 seconds if it was manually hidden
  useEffect(() => {
    if (!showNote && !isOpen) {
      const timer = setTimeout(() => {
        setShowNote(true);
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [showNote, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: "Our team usually responds within minutes. You can also call us directly at +91 98765 43210.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans flex flex-col items-end">
      
      {/* 1. CHAT WINDOW */}
      {isOpen && (
        <div className="mb-4 w-87.5 h-125 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-brand-blue p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl h-11 w-11 flex items-center justify-center">
                <img src={logo} alt="Pravin Lab" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest leading-none">Pravin Bot</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold text-blue-100 uppercase italic">Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-lg bg-white border border-gray-100 p-1 mr-2 self-end shadow-sm">
                    <img src={logo} alt="Bot" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-brand-blue text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-brand-blue/20 outline-none font-medium"
            />
            <button type="submit" disabled={!input.trim()} className="bg-brand-red text-white p-3 rounded-2xl hover:bg-red-600 active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* 2. PERSISTENT TOOLTIP */}
      {!isOpen && showNote && (
        <div className="relative mb-3 animate-bounce-subtle">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 pr-10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-widest whitespace-nowrap">
              Chat with us
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNote(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-brand-red transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
        </div>
      )}

      {/* 3. FLOATING BUTTON */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setShowNote(false); }}
        className={`p-4 rounded-full shadow-2xl transition-all duration-500 active:scale-90 flex items-center justify-center group ${
          isOpen ? 'bg-brand-red rotate-90' : 'bg-brand-blue hover:bg-brand-blue-hover'
        }`}
      >
        {isOpen ? <X className="text-white" size={28} /> : <MessageCircle className="text-white" size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;