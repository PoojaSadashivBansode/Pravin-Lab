import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { Menu, X, User, FileText, Calendar, LogOut, ChevronDown, LogIn, Globe } from "lucide-react"; 
import { useTranslation } from 'react-i18next';
import logo from "../assets/Logo1.png";
import AuthModal from "./AuthModal"; 

const Navbar = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const location = useLocation(); 

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'mr' : 'en';
    
    // 1. Updates the button text label
    i18n.changeLanguage(nextLang);

    // 2. Triggers the automatic page translation
    if (window.changeLanguageAuto) {
      window.changeLanguageAuto(nextLang);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tests", path: "/tests" },
    { name: "Packages", path: "/packages" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* LEFT: Logo */}
            <Link to="/" className="flex items-center gap-4 group cursor-pointer">
              <img src={logo} alt="Lab Logo" className="h-18 w-auto object-contain" />
            </Link>

            {/* RIGHT: Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* 1. Nav Links */}
              <div className="flex items-center gap-6 lg:gap-8 border-r border-gray-100 pr-6 lg:pr-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group relative py-1 text-[15px] font-semibold transition-colors duration-300
                        ${isActive ? 'text-brand-red' : 'text-text-primary hover:text-brand-blue'}`}
                    >
                      {link.name}
                      <span className={`absolute left-0 -bottom-0.5 h-0.5 transition-all duration-300
                          ${isActive ? 'w-full bg-brand-red' : 'w-0 group-hover:w-full'}`}
                      ></span>
                    </Link>
                  );
                })}
              </div>

              {/* 2. PROFILE DROPDOWN / LOGIN TRIGGER */}
              <div className="relative">
                <button 
                  onClick={() => isLoggedIn ? setIsProfileOpen(!isProfileOpen) : setAuthMode('login')}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md transition-all active:scale-95 bg-white"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isLoggedIn ? 'bg-gray-100 text-brand-blue' : 'bg-gray-50 text-gray-400'}`}>
                    <User size={20} />
                  </div>
                  <div className="text-left hidden lg:block mr-1">
                    <p className="text-[12px] font-bold text-gray-700 leading-none">
                      {isLoggedIn ? "Rahul Sharma" : "Login"}
                    </p>
                  </div>
                  {isLoggedIn && <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isLoggedIn && isProfileOpen && (
                  <>
                    <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Portal</p>
                        <p className="text-sm font-bold text-text-primary truncate">Rahul Sharma</p>
                      </div>
                      <Link to="/reports" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium">
                        <FileText size={16} /> My Reports
                      </Link>
                      <Link to="/bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium">
                        <Calendar size={16} /> Bookings
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={() => {setIsLoggedIn(false); setIsProfileOpen(false);}} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-red font-bold hover:bg-red-50 transition-colors">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  </>
                )}
              </div>

              {/* 3. LANGUAGE TOGGLE BUTTON */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-brand-blue/10 rounded-full hover:bg-brand-blue/5 hover:border-brand-blue/30 transition-all text-gray-700 bg-white"
              >
                <Globe size={16} className="text-brand-blue" />
                <span className="text-[13px] font-extrabold text-brand-blue">
                  {i18n.language === 'en' ? 'मराठी' : 'English'}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button Section */}
            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={toggleLanguage}
                className="px-2 py-1 border border-gray-200 rounded text-brand-blue font-bold text-xs"
              >
                {i18n.language === 'en' ? 'मराठी' : 'EN'}
              </button>
              <button className="text-text-primary" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-brand-red px-6 py-6 space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-semibold ${location.pathname === link.path ? 'text-brand-red' : 'text-text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <>
                  <Link to="/reports" className="block text-lg font-semibold text-gray-600 mb-4" onClick={() => setIsOpen(false)}>My Reports</Link>
                  <button onClick={() => {setIsLoggedIn(false); setIsOpen(false);}} className="text-lg font-bold text-brand-red">Logout</button>
                </>
              ) : (
                <button onClick={() => {setAuthMode('login'); setIsOpen(false);}} className="text-lg font-bold text-brand-blue">Login / Sign Up</button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        mode={authMode} 
        onClose={() => setAuthMode(null)} 
        setMode={setAuthMode}
        onLoginSuccess={() => { setIsLoggedIn(true); setAuthMode(null); }}
      />
    </>
  );
};

export default Navbar;