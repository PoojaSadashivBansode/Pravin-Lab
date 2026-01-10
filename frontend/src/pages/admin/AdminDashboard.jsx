/**
 * ===========================================
 *     ADMIN DASHBOARD - Overview Page
 * ===========================================
 * 
 * Admin dashboard with stats and quick actions.
 * 
 * @author Pravin Lab Team
 * @version 1.1.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { 
  TestTube, Package, ShoppingCart, Users, 
  TrendingUp, ArrowRight, Plus, IndianRupee
} from 'lucide-react';

/**
 * AdminDashboard Component
 * 
 * Displays overview statistics and recent activity.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tests: 0,
    packages: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pending: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        if (res.data.success) {
          const { counts, recentOrders } = res.data.data;
          setStats({
            tests: counts.tests || 0,
            packages: counts.packages || 0,
            orders: counts.orders || 0,
            users: counts.users || 0,
            revenue: counts.revenue || 0,
            pending: counts.pendingOrders || 0
          });
          setRecentOrders(recentOrders || []);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ----------------------------------------
  // STAT CARDS DATA
  // ----------------------------------------

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'green',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'blue',
      link: '/admin/orders',
      subtext: `${stats.pending} pending`
    },
    {
      title: 'Active Tests',
      value: stats.tests,
      icon: TestTube,
      color: 'purple',
      link: '/admin/tests'
    },
    {
      title: 'Reg. Users',
      value: stats.users,
      icon: Users,
      color: 'orange',
      link: '/admin/users'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100'
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to Pravin Lab Admin Panel</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/tests/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Test
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className={`p-6 bg-white rounded-xl border ${colorClasses[stat.color]} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                  {stat.subtext && <p className="text-xs mt-1 font-semibold opacity-80">{stat.subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${iconBgClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
          </div>
         
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-400 py-4">Loading...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders.</p>
            ) : (
              <div className="divide-y">
                {recentOrders.map((order, i) => (
                  <div key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{order.customerName || 'Customer'}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/tests"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
            >
              <TestTube className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Manage Tests</span>
            </Link>
            <Link
              to="/admin/packages"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-center"
            >
              <Package className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Manage Packages</span>
            </Link>
            <Link
              to="/admin/orders"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-center"
            >
              <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">View Orders</span>
            </Link>
            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
