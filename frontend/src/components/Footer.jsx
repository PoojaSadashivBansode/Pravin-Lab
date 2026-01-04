import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Instagram, Facebook, Award, Mail } from 'lucide-react';
import logo from "../assets/Logo1.png";

const Footer = () => {
  return (
    /* Key Changes:
      1. border-t-gray-300: Darkens the ruler line significantly.
      2. shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.1)]: Custom upward shadow.
      3. relative z-10: Ensures the shadow stays on top of page content.
    */
    <footer className="bg-white border-t border-gray-300 py-10 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.1)] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
          
          {/* 1. Brand & Trust Badges - Darkened text for better visibility */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Pravin Lab" className="h-10 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-brand-blue" /> NABL Accredited
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                <Award size={14} className="text-brand-red" /> ISO 9001:2015
              </div>
            </div>
          </div>

          {/* 2. Navigation - Increased contrast */}
          <div className="flex items-center gap-8">
            {['Tests', 'Packages', 'About', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`} 
                className="text-xs font-black text-gray-600 hover:text-brand-blue transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* 3. Contact & Social - High Visibility */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sm font-black text-brand-blue hover:text-brand-red transition-all active:scale-95">
              <Phone size={16} fill="currentColor" /> +91 98765 43210
            </a>
            <div className="flex gap-5 text-gray-400">
              <Facebook size={19} className="cursor-pointer hover:text-brand-blue transition-all hover:-translate-y-1" />
              <Instagram size={19} className="cursor-pointer hover:text-brand-red transition-all hover:-translate-y-1" />
              <Mail size={19} className="cursor-pointer hover:text-brand-blue transition-all hover:-translate-y-1" />
            </div>
          </div>
        </div>

        {/* 4. Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            © 2026 Pravin Clinical Laboratory • Precision in Every Report
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link to="/privacy" className="hover:text-brand-blue transition-colors underline decoration-transparent hover:decoration-brand-blue underline-offset-4">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-blue transition-colors underline decoration-transparent hover:decoration-brand-blue underline-offset-4">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;