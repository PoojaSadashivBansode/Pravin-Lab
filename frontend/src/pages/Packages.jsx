// src/pages/Packages.jsx - With API Integration
import { useState, useEffect } from 'react';
import axios from 'axios';
import PackageCard from '../components/PackageCard';
import { Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${API_URL}/packages`);
        setPackages(res.data.data || []);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <PackageCard 
                key={pkg._id}
                id={pkg._id}
                name={pkg.name}
                oldPrice={pkg.price?.toString()}
                newPrice={pkg.discountPrice?.toString() || pkg.price?.toString()}
                parameters={pkg.tests?.length?.toString() || "Multiple"}
                gender={pkg.category || "For All"}
                includes={pkg.tests?.slice(0, 5).map(t => t.name || t) || []}
                isPopular={pkg.isPopular}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No packages available yet.</p>
          </div>
        )}

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