import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-text-primary selection:bg-brand-blue/10 overflow-x-hidden">
      
      {/* 1. LIGHTWEIGHT HEADER */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> Secure & Confidential
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Our Medical Team</h1>
          <div className="h-1 w-12 bg-brand-red mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 2. REFINED TWO-COLUMN LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Clean Info List */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Direct Channels</h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-blue">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Emergency & Support</p>
                    <p className="text-lg font-bold">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-red">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email Inquiry</p>
                    <p className="text-lg font-bold">care@pravinlab.com</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-green-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Main Center</p>
                    <p className="text-lg font-bold leading-snug">123 Health Ave, Medical District, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-4xl border border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6 text-brand-blue">
                <Clock size={20} />
                <h4 className="font-bold">Operating Hours</h4>
              </div>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Mon - Sat</span>
                  <span className="text-black">07:00 - 21:00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sunday</span>
                  <span className="text-black">08:00 - 14:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Minimalist Form */}
          <div className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-text-primary mb-8">Send an Inquiry</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma" 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-3 outline-none focus:border-brand-blue transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contact Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000" 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-3 outline-none focus:border-brand-blue transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Message</label>
                <textarea 
                  rows="3" 
                  placeholder="How can we help you today?" 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-3 outline-none focus:border-brand-blue transition-colors placeholder:text-gray-300 resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button className="btn-primary rounded-full px-12 py-4 flex items-center gap-3 w-fit active:scale-95 shadow-lg shadow-brand-blue/10">
                  <Send size={18} />
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. SUBTLE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-[40px] overflow-hidden border border-gray-200 h-80 filter grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.793231185363!2d72.89737117505315!3d19.072814382131922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c627a20b17ad%3A0x311394602419a55!2sPravin%20Clinical%20Laboratory!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;