import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, ShieldCheck, FileText, AlertCircle, Check, Loader2, Users, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`${API_URL}/packages/${id}`);
        setPkg(res.data.data);
      } catch (error) {
        console.error('Error fetching package:', error);
        toast.error('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleBookNow = () => {
    addToCart(pkg, 'package');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
        <Link to="/packages" className="text-brand-blue hover:underline">← Back to Packages</Link>
      </div>
    );
  }

  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-blue hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Packages</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Package Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 border-t-4 border-t-brand-blue">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <ShieldCheck className="text-brand-blue" size={28} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-text-primary mb-2">{pkg.name}</h1>
                  {pkg.category && (
                    <div className="flex items-center gap-2 text-brand-blue font-semibold">
                      <Users size={18} />
                      <span>{pkg.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {pkg.description && (
                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              )}
            </div>

            {/* Included Tests */}
            {pkg.tests && pkg.tests.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="text-brand-blue" size={24} />
                  Included Tests ({pkg.tests.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pkg.tests.map((test, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Check size={18} className="text-green-500 mt-0.5" strokeWidth={3} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {typeof test === 'string' ? test : test.name}
                          </p>
                          {test.price && (
                            <p className="text-sm text-gray-500">₹{test.price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose This Package */}
            <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
              <h2 className="text-xl font-bold text-green-900 mb-4">
                Why Choose This Package?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-green-800">
                  <Check size={20} className="text-green-600 mt-0.5" strokeWidth={3} />
                  <span>Comprehensive health screening with {pkg.tests?.length || 'multiple'} tests</span>
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <Check size={20} className="text-green-600 mt-0.5" strokeWidth={3} />
                  <span>Save ₹{pkg.price - (pkg.discountPrice || pkg.price)} compared to individual tests</span>
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <Check size={20} className="text-green-600 mt-0.5" strokeWidth={3} />
                  <span>Free home sample collection at your convenience</span>
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <Check size={20} className="text-green-600 mt-0.5" strokeWidth={3} />
                  <span>Digital reports accessible anytime, anywhere</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black text-brand-red">
                    ₹{pkg.discountPrice || pkg.price}
                  </span>
                  {pkg.discountPrice && (
                    <span className="text-gray-400 line-through text-lg">₹{pkg.price}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    Save {discountPercent}% (₹{pkg.price - pkg.discountPrice})
                  </span>
                )}
              </div>

              {/* Package Summary */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Package Includes
                </p>
                <p className="text-2xl font-black text-brand-blue">
                  {pkg.tests?.length || 0} Tests
                </p>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/20 mb-4 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  <span>Free Home Sample Collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  <span>NABL Certified Lab</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  <span>Digital Reports in 24-48 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  <span>Expert Doctor Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
