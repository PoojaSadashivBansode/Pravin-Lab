import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Package, FileText, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to view your orders');
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      sample_collected: 'bg-purple-100 text-purple-700',
      processing: 'bg-indigo-100 text-indigo-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={18} />;
    if (status === 'cancelled') return <XCircle size={18} />;
    return <Clock size={18} />;
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-500">Track and manage your lab test orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 p-2 mb-8 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === tab.value
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? "You haven't placed any orders yet" : `No ${filter} orders`}
            </p>
            <Link to="/tests" className="inline-block px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              Browse Tests
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-brand-blue">{order._id}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Tests & Packages */}
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {order.tests?.map((test, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FileText className="text-red-500" size={18} />
                            <span className="flex-1 text-gray-700">{test.name}</span>
                            <span className="font-semibold text-gray-800">₹{test.discountPrice || test.price}</span>
                          </div>
                        ))}
                        {order.packages?.map((pkg, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Package className="text-blue-500" size={18} />
                            <span className="flex-1 text-gray-700">{pkg.name}</span>
                            <span className="font-semibold text-gray-800">₹{pkg.discountPrice || pkg.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collection & Payment Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">Collection</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} />
                            <span>{new Date(order.preferredDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} />
                            <span>{order.preferredTimeSlot}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">Payment</h3>
                        <p className="text-sm text-gray-600">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                        <p className={`text-sm font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </p>
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-black text-brand-red">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <Link
                    to={`/order-success/${order._id}`}
                    className="text-brand-blue hover:underline font-semibold text-sm"
                  >
                    View Details
                  </Link>
                  
                  {order.reports && order.reports.length > 0 && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold">
                      <Download size={16} />
                      Download Reports ({order.reports.length})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
