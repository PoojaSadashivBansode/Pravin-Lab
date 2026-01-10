import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Calendar, MapPin, CreditCard } from 'lucide-react';
import { api } from '../context/AuthContext';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">Thank you for choosing our lab services</p>
          {order && (
            <p className="text-sm text-gray-500 mt-2">
              Order ID: <span className="font-mono font-semibold text-brand-blue">{order._id}</span>
            </p>
          )}
        </div>

        {order && (
          <>
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6">
                {order.tests?.map((test, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{test.name}</p>
                      <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">Test</span>
                    </div>
                    <span className="font-semibold text-gray-800">₹{test.discountPrice || test.price}</span>
                  </div>
                ))}
                {order.packages?.map((pkg, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{pkg.name}</p>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Package</span>
                    </div>
                    <span className="font-semibold text-gray-800">₹{pkg.discountPrice || pkg.price}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                <span className="text-2xl font-black text-brand-red">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Collection Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-gray-800">Sample Collection</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Type:</span> <span className="font-semibold">{order.collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}</span></p>
                  <p><span className="text-gray-500">Date:</span> <span className="font-semibold">{new Date(order.preferredDate).toLocaleDateString()}</span></p>
                  <p><span className="text-gray-500">Time:</span> <span className="font-semibold">{order.preferredTimeSlot}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-gray-800">Payment Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Method:</span> <span className="font-semibold">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></p>
                  <p><span className="text-gray-500">Status:</span> <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span></p>
                </div>
              </div>
            </div>

            {/* Address (if home collection) */}
            {order.collectionType === 'home' && order.collectionAddress && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-gray-800">Collection Address</h3>
                </div>
                <p className="text-gray-700">
                  {order.collectionAddress.street}<br/>
                  {order.collectionAddress.city}, {order.collectionAddress.state} - {order.collectionAddress.pincode}
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8">
              <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>You will receive a confirmation call/SMS with sample collection details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Our certified phlebotomist will visit you at the scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Reports will be available within 24-48 hours on your dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Download reports anytime from "My Orders" section</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/my-orders"
            className="px-8 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-center"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
