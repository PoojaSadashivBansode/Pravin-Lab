import React, { useState, useEffect } from 'react';
import { X, Lock, User, Phone, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
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

  // Tracking which fields the user has interacted with
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Reset modal and CLEAR DATA
  const resetModal = () => {
    setStep(1);
    setFormData({ firstName: '', lastName: '', mobile: '', password: '' });
    setOtp(['', '', '', '', '', '']);
    setTouched({});
    setErrors({});
    onClose();
  };

  // Validation Logic
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!/^[A-Za-z]+$/.test(value)) error = "Only characters allowed";
        if (!value) error = "Required";
        break;
      case 'mobile':
        if (!/^\d{10}$/.test(value)) error = "Must be exactly 10 digits";
        break;
      case 'password':
        if (value.length < 8) error = "At least 8 characters required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent non-digits in mobile field immediately
    if (name === 'mobile' && !/^\d*$/.test(value)) return;
    // Prevent non-characters in name fields immediately
    if ((name === 'firstName' || name === 'lastName') && !/^[A-Za-z]*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation if already touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = () => {
    const commonValid = !errors.mobile && formData.mobile.length === 10 && 
                        !errors.password && formData.password.length >= 8;
    
    if (mode === 'register') {
      return commonValid && 
             formData.firstName && !errors.firstName && 
             formData.lastName && !errors.lastName;
    }
    return commonValid;
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) element.nextSibling.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      if (mode === 'register' && step === 1) {
        setStep(2);
      } else {
        // Success: Clear data and close
        onLoginSuccess();
        setTimeout(resetModal, 500); // Small timeout to allow transition
      }
    }
  };

  if (!mode) return null;

  // Helper component for Error messages
  const ErrorLabel = ({ name }) => (
    touched[name] && errors[name] ? (
      <span className="text-[9px] text-brand-red font-bold uppercase ml-2 animate-in fade-in slide-in-from-left-1">
        {errors[name]}
      </span>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={resetModal}></div>

      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
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

        <div className="px-10 pb-10">
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">
                      First Name <ErrorLabel name="firstName" />
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.firstName && touched.firstName ? 'text-brand-red' : 'text-gray-400'}`} size={16} />
                      <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur} placeholder="First" className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${errors.firstName && touched.firstName ? 'border-brand-red' : 'border-gray-100'} rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium`} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">
                      Last Name <ErrorLabel name="lastName" />
                    </label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Last" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.lastName && touched.lastName ? 'border-brand-red' : 'border-gray-100'} rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium`} />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">
                  Mobile Number <ErrorLabel name="mobile" />
                </label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.mobile && touched.mobile ? 'text-brand-red' : 'text-gray-400'}`} size={16} />
                  <input name="mobile" type="tel" maxLength="10" value={formData.mobile} onChange={handleInputChange} onBlur={handleBlur} placeholder="10 Digit Number" className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${errors.mobile && touched.mobile ? 'border-brand-red' : 'border-gray-100'} rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-primary uppercase tracking-widest ml-1">
                  Password <ErrorLabel name="password" />
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password && touched.password ? 'text-brand-red' : 'text-gray-400'}`} size={16} />
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} onBlur={handleBlur} placeholder="At least 8 characters" className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border ${errors.password && touched.password ? 'border-brand-red' : 'border-gray-100'} rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 mt-4 
                ${!isFormValid() ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-brand-blue hover:bg-brand-blue-hover active:scale-95 shadow-brand-blue/20'}`}
              >
                {mode === 'login' ? 'Log In' : 'Get OTP'} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="space-y-8 py-4">
              <div className="flex justify-between gap-3">
                {otp.map((data, index) => (
                  <input key={index} type="text" maxLength="1" className="w-12 h-14 border-2 border-gray-400 rounded-xl bg-gray-50 text-center text-xl font-bold focus:border-brand-blue focus:bg-white outline-none transition-all" value={data} onChange={(e) => handleOtpChange(e.target, index)} />
                ))}
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={!otp.every(d => d !== '')}
                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2
                ${!otp.every(d => d !== '') ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-brand-blue hover:bg-brand-blue-hover active:scale-95 shadow-brand-blue/20'}`}
              >
                Verify & Register Account <ArrowRight size={18} />
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest">
              {mode === 'login' ? "New Patient?" : "Back to"}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStep(1); setErrors({}); setTouched({}); }} className="ml-2 text-brand-red hover:text-red-700 font-black transition-all underline decoration-brand-red/30 underline-offset-4">
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