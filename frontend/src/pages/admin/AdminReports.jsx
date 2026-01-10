/**
 * ADMIN REPORTS - Consolidated Report View
 */

import { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { Search, FileText, Download, Calendar, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, [dateFilter]);

  const fetchReports = async () => {
    try {
      // Fetch orders that have reports uploaded
      // Note: In real app, might want a specific endpoint for this
      const res = await api.get('/orders/admin/all');
      
      if (res.data.success) {
        // Filter orders that have reports and flatten the list
        const reportsList = res.data.data
          .filter(order => order.reports && order.reports.length > 0)
          .flatMap(order => 
            order.reports.map(report => ({
              ...report,
              orderId: order._id,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              orderDate: order.createdAt
            }))
          )
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
          
        setReports(reportsList);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(item => 
    item.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
          <p className="text-gray-500">View and manage patient reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by patient name, report type or order ID..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            No reports found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Report Details</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Uploaded On</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{report.name}</p>
                        <p className="text-xs text-gray-500 font-mono">#{report.orderId.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{report.customerName}</p>
                    <p className="text-sm text-gray-500">{report.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(report.uploadedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
