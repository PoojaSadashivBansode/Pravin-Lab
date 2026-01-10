// src/pages/Home.jsx - Dynamic Hero Section + Banner Slider + Search Bar
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, ShieldCheck, Clock, Award, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";
import labHero from '../assets/Logo1.webp';
import TestCard from '../components/TestCard'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = '', duration = 2000, className = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCount = () => {
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentCount = Math.floor(startValue + (end - startValue) * easedProgress);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div ref={counterRef} className={className}>
      {formatNumber(count)}{suffix}
    </div>
  );
};

const Home = () => {
  const [tests, setTests] = useState([]);
  const [banners, setBanners] = useState([]);
  const [heroSettings, setHeroSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, bannersRes, heroRes] = await Promise.all([
          axios.get(`${API_URL}/tests`),
          axios.get(`${API_URL}/banners`),
          axios.get(`${API_URL}/hero-settings`)
        ]);
        setTests(testsRes.data.data?.slice(0, 4) || []);
        setBanners(bannersRes.data.data || []);
        setHeroSettings(heroRes.data.data || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="font-sans text-text-primary overflow-x-hidden">
      {/* HERO SECTION - Full Width Video Background (Fully Responsive) */}
      <section className="relative w-screen max-w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] md:h-[calc(100vh-80px)] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroSettings?.heroVideo || "/hero-bg.mp4"} type="video/mp4" />
          {/* Fallback to image if video not supported */}
          <img 
            src={heroSettings?.heroImage ? `http://localhost:5000${heroSettings.heroImage}` : labHero} 
            alt={heroSettings?.imageAlt || 'Laboratory'} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
        
        {/* Dark Overlay - Lighter for brighter video */}
        <div className="absolute inset-0 bg-black/30 sm:bg-gradient-to-r sm:from-black/50 sm:via-black/30 sm:to-transparent"></div>
        
        {/* Floating Medical Icons - Animated */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          {/* DNA Helix */}
          <div className="absolute top-[10%] right-[10%] text-white/20 animate-float-slow">
            <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 2h2v2c0 1.44.68 2.61 1.88 3.78C8.74 8.54 9.82 9.24 11 10v2c-1.18.76-2.26 1.46-3.12 2.22C6.68 15.39 6 16.56 6 18v2H4v2h16v-2h-2v-2c0-1.44-.68-2.61-1.88-3.78-.86-.76-1.94-1.46-3.12-2.22v-2c1.18-.76 2.26-1.46 3.12-2.22C17.32 6.61 18 5.44 18 4V2h2V0H4v2zm12 2c0 .64-.22 1.18-.64 1.69-.48.59-1.18 1.15-2.02 1.7-.64.42-1.38.86-2.02 1.28-.64-.42-1.38-.86-2.02-1.28-.84-.55-1.54-1.11-2.02-1.7C6.86 5.18 6.64 4.64 6.64 4V2h9.36v2z"/>
            </svg>
          </div>
          
          {/* Heart Pulse */}
          <div className="absolute top-[30%] right-[25%] text-white/15 animate-float-medium">
            <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          {/* Pill Capsule */}
          <div className="absolute bottom-[30%] right-[15%] text-white/20 animate-float-fast">
            <svg className="w-10 h-10 md:w-14 md:h-14 rotate-45" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.73 14.87l-5.66-5.66a2 2 0 00-2.83 0l-5.66 5.66a4 4 0 005.66 5.66l5.66-5.66a2 2 0 000-2.83zM7.56 18.45a2 2 0 010-2.83l4.24-4.24 2.83 2.83-4.24 4.24a2 2 0 01-2.83 0z"/>
            </svg>
          </div>
          
          {/* Plus Sign */}
          <div className="absolute top-[20%] left-[85%] sm:left-[75%] text-white/10 animate-pulse-slow">
            <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          
          {/* Droplet */}
          <div className="absolute bottom-[20%] right-[30%] text-white/15 animate-float-medium">
            <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
            </svg>
          </div>
          
          {/* Small Plus Signs scattered */}
          <div className="absolute top-[50%] right-[8%] text-white/10 animate-pulse">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div className="absolute top-[70%] right-[20%] text-white/10 animate-pulse-slow">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          
          {/* Microscope */}
          <div className="absolute bottom-[40%] right-[5%] text-white/10 animate-float-slow hidden md:block">
            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.46 6.28L11.05 9C11.25 9.34 11.21 9.78 10.93 10.06L9.47 11.52C9.19 11.8 8.75 11.84 8.41 11.64L6.37 10.44L4.83 11.98L7.19 13.17C7.54 13.36 7.76 13.72 7.76 14.12V15.5C7.76 16.33 8.43 17 9.26 17H13.26C14.08 17 14.76 16.33 14.76 15.5V14.12C14.76 13.72 14.97 13.36 15.32 13.16L17.69 11.97L16.14 10.43L14.11 11.63C13.77 11.83 13.33 11.79 13.05 11.51L11.59 10.05C11.31 9.77 11.27 9.33 11.47 8.99L13.05 6.27C13.39 5.69 13.19 4.94 12.62 4.6L11.75 4.09C11.17 3.75 10.43 3.95 10.08 4.53L9.46 6.28M19 17H15V19H21V17H19M5 17H3V19H9V17H5Z"/>
            </svg>
          </div>
        </div>
        
        {/* Hero Content - Fully Responsive */}
        <div className="relative z-10 h-full flex flex-col pt-12 sm:pt-16 md:pt-20 lg:pt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 text-center sm:text-left mx-auto sm:mx-0">
              {/* Responsive Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
                {heroSettings?.title || 'Book Lab Tests Online'} <br />
                <span className="text-brand-red uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  {heroSettings?.subtitle || 'WITH TRUSTED DIAGNOSTICS'}
                </span>
              </h1>
              
              {/* Responsive Description */}
              <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-[90%] sm:max-w-none mx-auto sm:mx-0">
                {heroSettings?.description || 'Accurate reports • Home sample collection • Online payment'}
              </p>
            </div>
          </div>
          
          {/* Professional Search Bar - Bottom Center - Matching Video */}
          <div className="absolute bottom-6 sm:bottom-10 md:bottom-16 left-0 right-0 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Search Box with Dark Glass Effect */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-full shadow-2xl overflow-hidden">
                <div className="flex items-center">
                  {/* Search Icon */}
                  <div className="flex-shrink-0 pl-5 sm:pl-6">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                  </div>
                  
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search for tests, packages, or health checkups..."
                    className="flex-1 py-4 sm:py-5 px-4 text-sm sm:text-base md:text-lg text-white placeholder:text-white/50 bg-transparent border-none outline-none focus:ring-0"
                  />
                  
                  {/* Search Button */}
                  <Link
                    to="/tests"
                    className="flex-shrink-0 m-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-brand-red hover:bg-red-600 text-white font-bold text-sm sm:text-base rounded-full transition-all shadow-lg hover:shadow-red-500/30"
                  >
                    <span className="hidden sm:inline">Find Tests</span>
                    <Search className="w-5 h-5 sm:hidden" />
                  </Link>
                </div>
              </div>
              
              {/* Popular Searches - Transparent Tags */}
              <div className="hidden sm:flex items-center justify-center gap-3 mt-4">
                <span className="text-xs text-white/60 font-medium">Popular:</span>
                <div className="flex flex-wrap gap-2">
                  {['CBC Test', 'Thyroid Profile', 'Diabetes Panel', 'Vitamin D', 'Full Body Checkup'].map((tag) => (
                    <Link
                      key={tag}
                      to="/tests"
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs text-white/80 hover:text-white rounded-full border border-white/10 transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS SECTION - Why Trust Us */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-bold rounded-full mb-3">
              TRUSTED BY THOUSANDS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3">
              Why Trust <span className="text-brand-red">Pravin Lab</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Accredited laboratory with state-of-the-art equipment and certified professionals delivering accurate results since 2007
            </p>
          </div>
          
          {/* Certifications Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-10 sm:mb-14">
            {/* NABL Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                NABL
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Accredited</p>
                <p className="text-sm font-bold text-gray-800">Laboratory</p>
              </div>
            </div>
            
            {/* ISO Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                ISO
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">ISO 9001:2015</p>
                <p className="text-sm font-bold text-gray-800">Certified</p>
              </div>
            </div>
            
            {/* WHO GMP Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                WHO
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">WHO GMP</p>
                <p className="text-sm font-bold text-gray-800">Compliant</p>
              </div>
            </div>
          </div>
          
          {/* Stats Counter + Ratings */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {/* Stat: Tests Completed */}
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl">
              <AnimatedCounter 
                end={9847} 
                suffix="+" 
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-red"
              />
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Tests Completed</p>
            </div>
            
            {/* Stat: Happy Patients */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl">
              <AnimatedCounter 
                end={7632} 
                suffix="+" 
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-blue"
              />
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Happy Patients</p>
            </div>
            
            {/* Stat: Partner Doctors */}
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl">
              <AnimatedCounter 
                end={483} 
                suffix="+" 
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-600"
              />
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Partner Doctors</p>
            </div>
            
            {/* Stat: Years Experience */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl">
              <AnimatedCounter 
                end={17} 
                suffix="+" 
                duration={1500}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-600"
              />
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Years Experience</p>
            </div>
            
            {/* Google Rating */}
            <div className="text-center p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <AnimatedCounter 
                  end={4.9} 
                  duration={1500}
                  className="text-xl font-black text-gray-800"
                />
              </div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <AnimatedCounter 
                end={1247} 
                suffix=" Reviews"
                duration={2000}
                className="text-[10px] text-gray-500 font-medium"
              />
            </div>
            
            {/* Practo Rating */}
            <div className="text-center p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-5 h-5 bg-[#14BEF0] rounded flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">P</span>
                </div>
                <AnimatedCounter 
                  end={4.8} 
                  duration={1500}
                  className="text-xl font-black text-gray-800"
                />
              </div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <AnimatedCounter 
                end={856} 
                suffix=" Reviews"
                duration={2000}
                className="text-[10px] text-gray-500 font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BANNER SLIDER SECTION - Shows if banners exist */}
      {banners.length > 0 && (
        <section className="relative overflow-hidden bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Banner Images */}
              <div className="relative h-[300px] md:h-[400px]">
                {banners.map((banner, idx) => (
                  <div
                    key={banner._id}
                    className={`absolute inset-0 transition-opacity duration-500 ${idx === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="px-8 md:px-12 max-w-xl text-white">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{banner.title}</h2>
                        {banner.subtitle && <p className="text-lg opacity-90 mb-4">{banner.subtitle}</p>}
                        {banner.buttonText && banner.buttonLink && (
                          <Link to={banner.buttonLink} className="inline-block px-6 py-2.5 bg-brand-red text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
                            {banner.buttonText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                  
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentBanner(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentBanner ? 'w-8 bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* POPULAR TESTS SECTION */}
      <section className="bg-[#F3F4F6] py-20"> 
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary mb-3">Popular Tests</h2>
              <div className="h-1.5 w-20 bg-brand-red rounded-full"></div>
            </div>
            <Link to="/tests" className="font-bold text-brand-blue border-b-2 border-brand-blue pb-1 hover:text-brand-blue-hover transition-all">
              View All Tests
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
          ) : tests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {tests.map((test) => (
                <TestCard 
                  key={test._id}
                  name={test.name}
                  oldPrice={test.price?.toString()}
                  newPrice={test.discountPrice?.toString() || test.price?.toString()}
                  parameters={test.parameters || "Multiple Parameters"}
                  time={test.reportTime || "Reports in 24 Hours"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No tests available yet.</div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Why Choose Us</h2>
          <div className="h-1.5 w-20 bg-brand-red rounded-full mx-auto mb-16"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Award size={40}/>, color: "bg-red-50", text: "NABL Certified", iconCol: "text-brand-red" },
              { icon: <ShieldCheck size={40}/>, color: "bg-blue-50", text: "Accurate Reports", iconCol: "text-brand-blue" },
              { icon: <Clock size={40}/>, color: "bg-green-50", text: "Home Collection", iconCol: "text-green-600" },
              { icon: <ShieldCheck size={40}/>, color: "bg-blue-50", text: "Secure Payment", iconCol: "text-brand-blue" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className={`${item.color} p-6 rounded-3xl mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <div className={item.iconCol}>{item.icon}</div>
                </div>
                <p className="font-bold text-xl">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;