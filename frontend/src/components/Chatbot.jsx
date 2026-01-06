import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, ChevronRight, Phone, ExternalLink, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from "../assets/Logo1.png"; 

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Pravin Lab. I am your health assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // --- MOVEABLE LOGIC STATE ---
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Advanced Menu Structure
  const menuOptions = [
    { label: "Book Home Visit", value: "home_visit", action: "link", path: "/bookings" },
    { label: "Check Report Status", value: "reports", action: "text", reply: "Please keep your Lab ID ready. You can check your reports in the 'My Reports' section after logging in." },
    { label: "Popular Test Packages", value: "packages", action: "text", reply: "We offer Full Body Checkups starting at ₹999. Would you like to view our packages?" },
    { label: "Contact a Doctor", value: "whatsapp", action: "whatsapp" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // --- DRAG EVENT HANDLERS ---
  const handleMouseDown = (e) => {
    if (isOpen) return; // Disable dragging while open
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleTouchStart = (e) => {
    if (isOpen) return;
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    };
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      hasMoved.current = true;
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Boundaries: 20px padding from edges
      const newX = Math.min(Math.max(20, clientX - dragStartPos.current.x), window.innerWidth - 80);
      const newY = Math.min(Math.max(20, clientY - dragStartPos.current.y), window.innerHeight - 80);
      
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const toggleChat = () => {
    if (!hasMoved.current) {
      setIsOpen(!isOpen);
    }
  };

  const handleAction = (option) => {
    if (option.action === 'whatsapp') {
      window.open("https://wa.me/919876543210?text=I%20need%20help%20with%20my%20lab%20test", "_blank");
      return;
    }

    const userMsg = { id: Date.now(), text: option.label, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = { id: Date.now() + 1, text: option.reply || "Redirecting you now...", sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I've noted your query. Our consultant will assist you shortly. In the meantime, you can call us at +91 98765 43210.", 
        sender: 'bot' 
      }]);
    }, 1500);
  };

  return (
    <div 
      className="fixed z-100 font-sans"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-137.5 bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* HEADER */}
          <div className="bg-linear-to-r from-brand-blue to-blue-700 p-6 text-white shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="bg-white p-1 rounded-xl h-12 w-12 flex items-center justify-center shadow-inner">
                    <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Pravin Health AI</h3>
                  <p className="text-blue-100 text-xs opacity-80">Online | Usually replies in 1m</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* CHAT AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-brand-blue text-white rounded-2xl rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <MoreHorizontal className="animate-pulse text-slate-400" size={20} />
                </div>
              </div>
            )}

            {!isTyping && (
              <div className="grid grid-cols-1 gap-2 pt-2 ml-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Select an option</p>
                {menuOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(opt)}
                    className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all group shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      {opt.action === 'whatsapp' ? <Phone size={14} className="text-green-500" /> : <ChevronRight size={14} className="text-brand-blue" />}
                      {opt.label}
                    </span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input 
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 ring-brand-blue/20 outline-none"
            />
            <button type="submit" disabled={!input.trim()} className="bg-brand-blue text-white p-3 rounded-xl hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50 transition-all">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TRIGGER (DRAGGABLE AREA) */}
      <button 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={toggleChat}
        className={`w-16 h-16 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center justify-center group select-none cursor-grab active:cursor-grabbing ${
          isOpen ? 'bg-brand-red rotate-90' : 'bg-brand-blue hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white" size={30} /> : <MessageCircle className="text-white" size={30} />}
      </button>
    </div>
  );
};

export default Chatbot;