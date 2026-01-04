import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import logo from "../assets/Logo1.png";

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F3F4F6] px-4 py-12">
      <div className="w-full max-w-125 bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 border border-gray-100">
        
        <div className="text-center mb-10">
          <img src={logo} alt="Pravin Lab" className="h-10 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Create Account</h1>
          <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Join Pravin Clinical Lab</p>
        </div>

        <form className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Rahul Sharma" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Mobile</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="tel" placeholder="+91" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" placeholder="mail@site.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 py-2">
            <input type="checkbox" className="w-4 h-4 rounded accent-brand-blue" id="terms" />
            <label htmlFor="terms" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">
              I agree to the <span className="text-brand-blue">Terms & Privacy</span>
            </label>
          </div>

          <button className="w-full bg-brand-red text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-red/20 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 group tracking-widest text-sm">
            SIGN UP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-brand-blue hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;