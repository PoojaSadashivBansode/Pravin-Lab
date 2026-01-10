import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Clock, Droplets, FileText, AlertCircle, Check, Loader2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`${API_URL}/tests/${id}`);
        setTest(res.data.data);
      } catch (error) {
        console.error('Error fetching test:', error);
        toast.error('Failed to load test details');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleBookNow = () => {
    addToCart(test, 'test');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Not Found</h2>
        <Link to="/tests" className="text-brand-blue hover:underline">← Back to Tests</Link>
      </div>
    );
  }

  const discountPercent = test.discountPrice 
    ? Math.round(((test.price - test.discountPrice) / test.price) * 100)
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
          <span>Back to Tests</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Test Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <Droplets className="text-brand-red" size={28} fill="#D32F2F" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-text-primary mb-2">{test.name}</h1>
                  {test.category && (
                    <span className="inline-block bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-sm font-semibold">
                      {test.category}
                    </span>
                  )}
                </div>
              </div>

              {test.description && (
                <p className="text-gray-600 leading-relaxed">{test.description}</p>
              )}
            </div>

            {/* Parameters */}
            {test.parameters && test.parameters.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="text-brand-blue" size={24} />
                  Test Parameters
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {test.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check size={16} className="text-green-500" strokeWidth={3} />
                      <span>{param}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Instructions */}
            {test.preparationInstructions && (
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-amber-600" size={24} />
                  Preparation Instructions
                </h2>
                <p className="text-amber-800 leading-relaxed">{test.preparationInstructions}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black text-brand-red">
                    ₹{test.discountPrice || test.price}
                  </span>
                  {test.discountPrice && (
                    <span className="text-gray-400 line-through text-lg">₹{test.price}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Test Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {test.sampleType && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Droplets size={18} className="text-brand-blue" />
                    <div>
                      <p className="text-xs text-gray-500">Sample Type</p>
                      <p className="font-semibold">{test.sampleType}</p>
                    </div>
                  </div>
                )}
                {test.reportTime && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock size={18} className="text-brand-blue" />
                    <div>
                      <p className="text-xs text-gray-500">Report Time</p>
                      <p className="font-semibold">{test.reportTime}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              {/* Features */}
              <div className="mt-6 space-y-2">
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
                  <span>Digital Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetail;
