// src/pages/Tests.jsx - With API Integration
import { useState, useEffect } from 'react';
import axios from 'axios';
import TestCard from '../components/TestCard';
import { Search, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tests");
  const [categories, setCategories] = useState(["All Tests"]);

  // Fetch tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(`${API_URL}/tests`);
        const testsData = res.data.data || [];
        setTests(testsData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(testsData.map(t => t.category).filter(Boolean))];
        setCategories(["All Tests", ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Filter Logic
  const filteredTests = tests.filter((test) => {
    const matchesCategory = selectedCategory === "All Tests" || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
              </div>
            ) : filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                {filteredTests.map((test) => (
                  <TestCard 
                    key={test._id}
                    id={test._id}
                    name={test.name}
                    oldPrice={test.price?.toString()}
                    newPrice={test.discountPrice?.toString() || test.price?.toString()}
                    parameters={test.parameters || "Multiple Parameters"}
                    time={test.reportTime || "Reports in 24 Hours"}
                    isPopular={test.isPopular}
                  />
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