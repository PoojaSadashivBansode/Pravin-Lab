import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Instagram, Facebook } from 'lucide-react';
import logo from "../assets/Logo1.png";

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Brand & Lab Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white px-3 py-2 rounded-lg">
              <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
            </Link>
            <h3 className="text-lg font-bold">PRAVIN CLINICAL LABORATORY</h3>
            <div className="flex items-center gap-2 border-t border-white/20 pt-4 text-xs font-bold uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-1"><ShieldCheck size={14}/> NABL Certified</span>
              <span className="px-2">•</span>
              <span>ISO 9001</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Tests', 'Packages', 'About', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  to={`/${item.toLowerCase()}`} 
                  className="text-sm hover:text-brand-red transition-colors py-1"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">Contact Us</h4>
            <div className="space-y-3">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" 
                className="flex items-start gap-3 text-sm hover:text-brand-red transition-colors">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>Bypass Road Near Krishnpriya Hall, Akluj</span>
              </a>
              <a href="tel:+919970174501" className="flex items-center gap-3 text-sm hover:text-brand-red transition-colors">
                <Phone size={18} />
                <span className="font-bold">+91 9970174501</span>
              </a>
              <a href="mailto:prashantkokate410@gmail.com" className="flex items-center gap-3 text-sm hover:text-brand-red transition-colors">
                <Mail size={18} />
                <span>prashantkokate410@gmail.com</span>
              </a>
            </div>
            
            {/* Socials */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} PRAVIN CLINICAL LABORATORY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;