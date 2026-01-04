import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react'; // Ensure these are imported
import PackageCard from '../components/PackageCard';

const Packages = () => {
  const healthPackages = [
    {
      name: "Basic Wellness Package",
      oldPrice: "1999",
      newPrice: "999",
      parameters: "35",
      gender: "For All Genders",
      includes: ["CBC", "Urine Routine", "Blood Sugar", "Cholesterol"]
    },
    {
      name: "Executive Full Body Checkup",
      oldPrice: "4500",
      newPrice: "2499",
      parameters: "72",
      gender: "Recommended 30+ Age",
      includes: ["Liver Profile", "Kidney Profile", "Thyroid", "Vitamin D & B12", "HbA1c"]
    },
    {
      name: "Senior Citizen Advanced",
      oldPrice: "6000",
      newPrice: "3499",
      parameters: "85",
      gender: "Male / Female specific",
      includes: ["Cardiac Markers", "Iron Studies", "Arthritis Screening", "Pancreas Map"]
    },
    {
      name: "Women Health Special",
      oldPrice: "3500",
      newPrice: "1899",
      parameters: "50",
      gender: "Exclusively for Women",
      includes: ["Hormone Profile", "Anaemia Screening", "Bone Health", "Vitamin Profile"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <div className="bg-[#FBFBFB] pt-4 lg:pt-6 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Comprehensive <span className="text-brand-red">Health Packages</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Invest in your health with our specially curated checkup bundles. 
            Designed for early detection and complete peace of mind.
          </p>
        </div>
      </div>

      {/* Packages Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {healthPackages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>

        {/* UPDATED: Home Sample Collection Banner */}
        <div className="mt-20 bg-white border border-gray-300 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Premium Service
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase tracking-tight leading-none">
              Free Home Sample Collection
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              Book any package and get a certified phlebotomist at your doorstep with 100% safety protocols.
            </p>
          </div>
          
          <button className="bg-brand-blue text-white px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-brand-blue-hover hover:shadow-2xl hover:shadow-brand-blue/30 transition-all active:scale-95 flex items-center gap-3 whitespace-nowrap">
            Book Now <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;