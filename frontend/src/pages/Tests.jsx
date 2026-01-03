import React, { useState } from 'react';
import TestCard from '../components/TestCard';
import { Search } from 'lucide-react';

const Tests = () => {
  // 1. State for Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tests");

  const categories = [
    "All Tests",
    "Blood Test",
    "Diabetes",
    "Thyroid",
    "Vitamin",
    "Organ Health", // Liver, Kidney, Cardiac
    "Screening"
  ];

  const allTests = [
    { name: "Complete Blood Count (CBC)", oldPrice: "899", newPrice: "499", parameters: "60+ Parameters", time: "Reports in 24 Hours", category: "Blood Test" },
    { name: "Thyroid Profile (Total T3, T4, TSH)", oldPrice: "999", newPrice: "699", parameters: "3 Parameters", time: "Reports in 24 Hours", category: "Thyroid", isPopular: true },
    { name: "Lipid Profile (Cholesterol)", oldPrice: "1200", newPrice: "899", parameters: "8 Parameters", time: "Reports in 12 Hours", category: "Organ Health" },
    { name: "Liver Function Test (LFT)", oldPrice: "1500", newPrice: "1100", parameters: "11 Parameters", time: "Reports in 24 Hours", category: "Organ Health" },
    { name: "Kidney Function Test (KFT)", oldPrice: "1400", newPrice: "999", parameters: "9 Parameters", time: "Reports in 24 Hours", category: "Organ Health" },
    { name: "Diabetes Screening (HbA1c + Sugar)", oldPrice: "850", newPrice: "649", parameters: "2 Parameters", time: "Reports in 12 Hours", category: "Diabetes", isPopular: true },
    { name: "Vitamin B12 Checkup", oldPrice: "1100", newPrice: "799", parameters: "1 Parameter", time: "Reports in 24 Hours", category: "Vitamin" },
    { name: "Vitamin D (25-Hydroxy)", oldPrice: "1600", newPrice: "1249", parameters: "1 Parameter", time: "Reports in 24 Hours", category: "Vitamin" },
    { name: "Urine Routine & Microscopy", oldPrice: "350", newPrice: "199", parameters: "20+ Parameters", time: "Reports in 12 Hours", category: "Screening" },
    { name: "Iron Studies Profile", oldPrice: "1200", newPrice: "899", parameters: "4 Parameters", time: "Reports in 24 Hours", category: "Blood Test" },
    { name: "Cardiac Risk Markers", oldPrice: "2400", newPrice: "1799", parameters: "5 Parameters", time: "Reports in 48 Hours", category: "Organ Health" },
    { name: "Electrolytes Profile", oldPrice: "900", newPrice: "599", parameters: "3 Parameters", time: "Reports in 12 Hours", category: "Organ Health" },
    { name: "Fever Profile (Basic)", oldPrice: "1800", newPrice: "1299", parameters: "15+ Parameters", time: "Reports in 24 Hours", category: "Screening" },
    { name: "Double Marker Screening", oldPrice: "3500", newPrice: "2600", parameters: "2 Parameters", time: "Reports in 48 Hours", category: "Screening" },
    { name: "D-Dimer Test", oldPrice: "1400", newPrice: "1099", parameters: "1 Parameter", time: "Reports in 12 Hours", category: "Blood Test" },
    { name: "Calcium Checkup", oldPrice: "400", newPrice: "249", parameters: "1 Parameter", time: "Reports in 24 Hours", category: "Blood Test" }
  ];

  // 2. Filter Logic
  const filteredTests = allTests.filter((test) => {
    const matchesCategory = selectedCategory === "All Tests" || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Page Header + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-text-primary mb-3">Diagnostic Tests</h1>
            <div className="h-1.5 w-24 bg-brand-red rounded-full"></div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for a test..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 ring-brand-blue/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDEBAR: Categories */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold mb-4 px-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === cat 
                      ? "bg-brand-blue text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-brand-blue"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE: Test Grid */}
          <div className="flex-1">
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                {filteredTests.map((test, index) => (
                  <TestCard key={index} {...test} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No tests found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("All Tests");}}
                  className="mt-4 text-brand-blue font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Tests;