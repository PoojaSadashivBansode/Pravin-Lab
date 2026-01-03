// src/pages/Packages.jsx
import React from 'react';
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
      {/* Header Section */}
      <div className="bg-white py-16 border-b border-gray-100">
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

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {healthPackages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>

        {/* Home Sample Collection Banner */}
        <div className="mt-20 bg-brand-blue rounded-[40px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Free Home Sample Collection</h2>
            <p className="opacity-90">Book any package and get a certified phlebotomist at your doorstep.</p>
          </div>
          <button className="bg-white text-brand-blue px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;