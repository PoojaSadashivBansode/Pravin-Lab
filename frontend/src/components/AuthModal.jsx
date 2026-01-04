import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import logo from "../assets/Logo1.png";

const AuthModal = ({ mode, onClose, setMode, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    password: ''
  });

  if (!mode) return null;

  const isFormValid = () => {
    if (mode === 'register') {
      return formData.firstName && formData.lastName && formData.mobile && formData.password;
    }
    return formData.mobile && formData.password;
  };

  const isOtpValid = otp.every(digit => digit !== '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) element.nextSibling.focus();
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ firstName: '', lastName: '', mobile: '', password: '' });
    setOtp(['', '', '', '', '', '']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={resetModal}></div>

      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="relative p-10 pb-6">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="absolute left-8 top-8 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
          )}
          <button onClick={resetModal} className="absolute right-8 top-8 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-400" />
          </button>

          <div className="text-center">
            <img src={logo} alt="Pravin Lab" className="h-10 w-auto mx-auto mb-5" />
            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">
              {step === 1 ? (mode === 'login' ? 'Welcome Back' : 'Create Account') : 'Verify OTP'}
            </h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-10 pb-10">
          {step === 1 ? (
            <form className="space-y-5" onSubmit={(e) => { 
              e.preventDefault(); 
              if(isFormValid()) mode === 'register' ? setStep(2) : onLoginSuccess(); 
            }}>
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">Last Name</label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-medium" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-text-primary uppercase tracking-widest">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-medium" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid()}
                style={{ backgroundColor: !isFormValid() ? '#4D4D4D' : undefined }}
                className={`w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 mt-4 
                ${!isFormValid() ? 'cursor-not-allowed shadow-none' : 'active:scale-95 ' + (mode === 'login' ? 'bg-brand-blue hover:bg-brand-blue-hover shadow-brand-blue/20' : 'bg-brand-red hover:bg-red-600 shadow-brand-red/20')}`}
              >
                {mode === 'login' ? 'Log In' : 'Get OTP'} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="space-y-8 py-4">
              <div className="flex justify-between gap-3">
                {otp.map((data, index) => (
                  <input key={index} type="text" maxLength="1" className="w-12 h-14 border-2 border-gray-100 rounded-xl bg-gray-50 text-center text-xl font-bold focus:border-brand-red focus:bg-white outline-none transition-all" value={data} onChange={(e) => handleOtpChange(e.target, index)} />
                ))}
              </div>
              <button 
                onClick={() => onLoginSuccess()} 
                disabled={!isOtpValid}
                style={{ backgroundColor: !isOtpValid ? '#4D4D4D' : undefined }}
                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2
                ${!isOtpValid ? 'cursor-not-allowed shadow-none' : 'active:scale-95 bg-brand-red hover:bg-red-600 shadow-brand-red/20'}`}
              >
                Verify & Register Account <ArrowRight size={18} />
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest">
              {mode === 'login' ? "New Patient?" : "Back to"}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStep(1); }} className="ml-2 text-brand-red hover:text-red-700 font-black transition-all underline decoration-brand-red/30 underline-offset-4">
                {mode === 'login' ? 'Register Now' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;