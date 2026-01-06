import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: { home: "Home", tests: "Tests", packages: "Packages", about: "About Us", contact: "Contact", login: "Login" },
          hero: { h1: "Book Lab Tests Online", sub: "with Trusted Diagnostics", desc: "Accurate reports • Home sample collection • Online payment", search: "Search", placeholder: "Search tests..." },
          tests: { popular: "Popular Tests", view_all: "View All Tests" },
          why: { title: "Why Choose Us", nabl: "NABL Certified", accurate: "Accurate Reports", home: "Home Collection", secure: "Secure Payment" }
        }
      },
      mr: {
        translation: {
          nav: { home: "मुख्यपृष्ठ", tests: "चाचण्या", packages: "पॅकेजेस", about: "आमच्याबद्दल", contact: "संपर्क", login: "लॉगिन" },
          hero: { h1: "लॅब चाचण्या ऑनलाइन बुक करा", sub: "विश्वसनीय निदानासह", desc: "अचूक रिपोर्ट्स • घरून नमुना संकलन • ऑनलाइन पेमेंट", search: "शोधा", placeholder: "चाचण्या शोधा..." },
          tests: { popular: "लोकप्रिय चाचण्या", view_all: "सर्व चाचण्या पहा" },
          why: { title: "आम्हाला का निवडावे", nabl: "NABL प्रमाणित", accurate: "अचूक अहवाल", home: "होम कलेक्शन", secure: "सुरक्षित पेमेंट" }
        }
      }
    },
    fallbackLng: "en",
    detection: { order: ['localStorage', 'cookie'], caches: ['localStorage'] },
    interpolation: { escapeValue: false }
  });

export default i18n;