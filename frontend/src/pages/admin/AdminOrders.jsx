/**
 * ===========================================
 *    ADMIN ORDERS - Manage Customer Orders
 * ===========================================
 * 
 * Admin page for managing customer orders with:
 * - View all orders with filtering
 * - Update order status
 * - View order details
 * - Update payment status
 * - Upload reports
 * 
 * @author Pravin Lab Team
 * @version 1.1.0
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { 
  Search, Eye, X, Loader2, ShoppingCart, 
  Clock, CheckCircle, Truck, Package, XCircle,
  Phone, Mail, MapPin, Calendar, CreditCard,
  FileText, Upload, Link as LinkIcon, Users
} from 'lucide-react';

/**
 * AdminOrders Component
 */
export default function AdminOrders() {
  // ----------------------------------------
  // STATE
  // ----------------------------------------
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Report Upload State
  const [uploadingReport, setUploadingReport] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportFile, setReportFile] = useState(null);

  // ----------------------------------------
  // STATUS CONFIG
  // ----------------------------------------
  const statusConfig = {
    pending: { label: 'Pending', color: 'yellow', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'blue', icon: CheckCircle },
    sample_collected: { label: 'Sample Collected', color: 'indigo', icon: Truck },
    processing: { label: 'Processing', color: 'purple', icon: Package },
    completed: { label: 'Completed', color: 'green', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'red', icon: XCircle }
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-50 text-yellow-700',
    paid: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-50 text-gray-700'
  };

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // ----------------------------------------
  // API CALLS
  // ----------------------------------------

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await api.get(`/orders/admin/all${params}`);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, { status, paymentStatus });
      toast.success('Order updated successfully');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status, paymentStatus }));
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!reportFile || !reportName) return;

    setUploadingReport(true);
    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('file', reportFile);
      
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!uploadRes.data.success) throw new Error('File upload failed');

      const fileUrl = uploadRes.data.file.url;

      // 2. Add Report to Order
      const res = await api.put(`/orders/${selectedOrder._id}/reports`, {
        name: reportName,
        url: fileUrl
      });

      toast.success('Report uploaded successfully');
      setReportName('');
      setReportFile(null);
      
      // Update local state
      setSelectedOrder(prev => ({
        ...prev,
        reports: res.data.data.reports
      }));
      fetchOrders(); // Refresh table too

    } catch (error) {
      console.error('Report upload error:', error);
      toast.error('Failed to upload report');
    } finally {
      setUploadingReport(false);
    }
  };

  // ----------------------------------------
  // HANDLERS
  // ----------------------------------------

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Filter orders by search
  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-gray-500">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="sample_collected">Sample Collected</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm text-gray-600">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                          bg-${statusConfig[order.status]?.color}-50 text-${statusConfig[order.status]?.color}-700`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[order.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                          {order.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              {/* Top Grid: Customer & Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" /> Customer Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="font-medium text-lg">{selectedOrder.customerName}</p>
                    <p className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" /> {selectedOrder.customerEmail}
                    </p>
                    <p className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" /> {selectedOrder.customerPhone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" /> Collection Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="font-medium">
                      {selectedOrder.collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}
                    </p>
                    {selectedOrder.collectionType === 'home' && selectedOrder.collectionAddress && (
                      <p className="text-gray-600">
                        {selectedOrder.collectionAddress.street}, {selectedOrder.collectionAddress.city},<br/>
                        {selectedOrder.collectionAddress.state} - {selectedOrder.collectionAddress.pincode}
                      </p>
                    )}
                    {selectedOrder.preferredDate && (
                      <p className="flex items-center gap-2 text-gray-600 mt-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedOrder.preferredDate).toLocaleDateString()}
                        {selectedOrder.preferredTimeSlot && ` • ${selectedOrder.preferredTimeSlot}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                    Items Ordered
                  </div>
                  <div className="divide-y divide-gray-100">
                    {selectedOrder.tests?.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Test</p>
                        </div>
                        <span className="font-medium">₹{item.discountPrice || item.price}</span>
                      </div>
                    ))}
                    {selectedOrder.packages?.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-4">
                         <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Package</p>
                        </div>
                        <span className="font-medium">₹{item.discountPrice || item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-5 h-fit">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-blue-200/60">
                    <span>Total</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200/60 text-sm">
                     <p className="flex items-center justify-between text-gray-600 mb-1">
                      Method: <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                     </p>
                     <p className="flex items-center justify-between text-gray-600">
                      Status: 
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                     </p>
                  </div>
                </div>
              </div>

              {/* Status Updates */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Update Order</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}
                      disabled={updating}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="sample_collected">Sample Collected</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, selectedOrder.status, e.target.value)}
                      disabled={updating}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reports Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Reports
                  </h3>
                </div>
                
                <div className="p-5">
                  {/* Existing Reports */}
                  {selectedOrder.reports && selectedOrder.reports.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {selectedOrder.reports.map((report, idx) => (
                        <a 
                          key={idx} 
                          href={report.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{report.name}</p>
                            <p className="text-xs text-gray-500">{new Date(report.uploadedAt).toLocaleDateString()}</p>
                          </div>
                          <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-6 italic">No reports uploaded yet.</p>
                  )}

                  {/* Upload Form */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Upload New Report</h4>
                    <form onSubmit={handleUploadReport} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Report Name (e.g. Blood Test Result)"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setReportFile(e.target.files[0])}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                      <button
                        type="submit"
                        disabled={uploadingReport || !reportFile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploadingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
