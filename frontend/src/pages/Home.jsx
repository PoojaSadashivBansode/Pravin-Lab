import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldCheck, Clock, Award } from 'lucide-react';
import { Link } from "react-router-dom";
import TestCard from '../components/TestCard'; 

// Asset Imports
import hero1 from "../assets/2ad26483ff880ed649dcad98065aaaeb.jpg";
import hero2 from "../assets/download.jpeg";
import hero3 from "../assets/images (1).jpeg";
import hero4 from "../assets/images.jpeg";
import hero5 from "../assets/Logo1.webp";

const Home = () => {
  const originalImages = [hero1, hero2, hero3, hero4, hero5];
  // 1. Create a loop array: [Last Image, ...Originals, First Image]
  const heroImages = [originalImages[originalImages.length - 1], ...originalImages, originalImages[0]];

  // 2. State & Refs for Infinite Logic
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (the first real image)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  // 3. Handle the "Jump" after transition ends
  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      // If we slid back to the "clone" of the last image
      setIsTransitioning(false);
      setCurrentIndex(heroImages.length - 2);
    } else if (currentIndex === heroImages.length - 1) {
      // If we slid forward to the "clone" of the first image
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  // 4. Reset transitioning state to allow smooth movement again
  useEffect(() => {
    if (!isTransitioning) {
      // Small delay to allow the "jump" to happen without animation
      timeoutRef.current = setTimeout(() => setIsTransitioning(true), 50);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isTransitioning]);

  // 5. Auto-slide Logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const popularTests = [
    { name: "Complete Blood Count (CBC) Test", oldPrice: "899", newPrice: "499", parameters: "60+ Parameters", time: "Reports in 24 Hours" },
    { name: "Thyroid Profile (Total T3, T4 & TSH)", oldPrice: "999", newPrice: "699", parameters: "3 Parameters", time: "Reports in 24 Hours" },
    { name: "Diabetes Screening (HbA1c + Sugar)", oldPrice: "850", newPrice: "699", parameters: "2 Parameters", time: "Reports in 12 Hours" },
    { name: "Lipid Profile (Cholesterol)", oldPrice: "1200", newPrice: "899", parameters: "8 Parameters", time: "Reports in 24 Hours" }
  ];

  return (
    <div className="font-sans text-text-primary">
      {/* HERO SECTION */}
      <section className="bg-[#FBFBFB] pt-4 lg:pt-6 pb-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6 z-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Book Lab Tests Online <br />
              <span className="text-brand-red uppercase">with Trusted Diagnostics</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Accurate reports • Home sample collection • Online payment 
            </p>
            
            <div className="flex items-center bg-white border border-border-light rounded-xl p-2 shadow-md max-w-xl focus-within:ring-2 ring-brand-blue/20 transition-all">
              <Search className="text-text-muted ml-3" size={20} />
              <input type="text" placeholder="Search tests..." className="flex-1 px-4 py-2 outline-none text-text-secondary font-medium" />
              <button className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-blue-hover transition-colors">Search</button> 
            </div>
          </div>

          {/* INFINITE SLIDING SECTION */}
          <div 
            className="flex-1 relative w-full h-75 lg:h-112.5 overflow-hidden rounded-2xl shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className="flex h-full"
              onTransitionEnd={handleTransitionEnd}
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? 'transform 700ms ease-in-out' : 'none'
              }}
            >
              {heroImages.map((img, index) => (
                <div key={index} className="w-full h-full shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Pagination Dots (Mapped to original array length) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {originalImages.map((_, index) => {
                // Adjust index check because currentIndex starts at 1
                const isActive = (currentIndex === index + 1) || 
                                 (currentIndex === 0 && index === originalImages.length - 1) ||
                                 (currentIndex === heroImages.length - 1 && index === 0);
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index + 1)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive ? "bg-brand-red h-2 w-2" : "bg-white/60 w-2 hover:bg-white"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TESTS SECTION */}
      <section className="bg-[#F3F4F6] py-20"> 
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary mb-3">Popular Tests</h2>
              <div className="h-1.5 w-20 bg-brand-red rounded-full"></div>
            </div>
            <Link to="/tests" className="text-brand-blue border-b-2 border-brand-blue font-semibold">
              View All Tests
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {popularTests.map((test, index) => (
              <TestCard key={index} {...test} />
            ))}
          </div>
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
              <div key={i} className="flex flex-col items-center group">
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