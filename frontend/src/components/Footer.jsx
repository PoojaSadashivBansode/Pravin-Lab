import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Instagram, Facebook } from 'lucide-react';
import logo from "../assets/Logo1.png";

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* 1. Brand & Tiny Certs */}
          <div className="flex items-center gap-6">
            <Link to="/" className="bg-white px-2 py-1 rounded-lg">
              <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
            </Link>
            <div className="hidden sm:flex items-center gap-4 border-l border-white/20 pl-6 text-[9px] font-bold uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-1"><ShieldCheck size={12}/> NABL</span>
              <span className="flex items-center gap-1">ISO 9001</span>
            </div>
          </div>

          {/* 2. Single Line Navigation */}
          <div className="flex items-center gap-6">
            {['Tests', 'Packages', 'About', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`} 
                className="text-[11px] font-bold uppercase tracking-wider hover:text-brand-red transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* 3. Essential Contact & Socials */}
          <div className="flex items-center gap-6">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-xs font-black">
              <Phone size={14} fill="white" /> +91 98765 43210
            </a>
            <div className="flex gap-3 border-l border-white/20 pl-6">
              <Facebook size={16} className="cursor-pointer hover:text-brand-red transition-colors" />
              <Instagram size={16} className="cursor-pointer hover:text-brand-red transition-colors" />
            </div>
          </div>

        </div>

        {/* 4. Micro Copyright */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center md:text-left">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] opacity-50">
            © 2026 Pravin Clinical Laboratory • Precision in Every Report
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;