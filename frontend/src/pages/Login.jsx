import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import logo from "../assets/Logo1.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F3F4F6] px-4 py-12">
      <div className="w-full max-w-112.5 bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 border border-gray-100">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <img src={logo} alt="Pravin Lab" className="h-12 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="example@mail.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-brand-blue hover:underline uppercase tracking-widest">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-brand-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-hover transition-all active:scale-95 flex items-center justify-center gap-2 group mt-4 tracking-widest text-sm">
            LOG IN <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Don't have an account? <Link to="/register" className="text-brand-red hover:text-brand-red-hover transition-colors">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;