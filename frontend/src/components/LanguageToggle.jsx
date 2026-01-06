import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-blue/20 rounded-full shadow-sm hover:shadow-md hover:border-brand-blue transition-all group"
    >
      <Globe size={18} className="text-brand-blue group-hover:rotate-12 transition-transform" />
      <span className="font-bold text-sm text-gray-700">
        {/* If English, show Marathi label; if Marathi, show English label */}
        {i18n.language === 'en' ? 'मराठी' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;