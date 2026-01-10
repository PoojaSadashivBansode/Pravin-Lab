import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, FileText, AlertCircle } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to view your bookings');
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-green-100 text-green-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      rescheduled: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-500">Manage your sample collection appointments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">You haven't scheduled any sample collection appointments</p>
            <Link to="/tests" className="inline-block px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              Book a Test
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Booking Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Calendar className="w-6 h-6 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Clock size={14} />
                          {booking.timeSlot}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Booking Body */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Patient Information */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <User size={18} className="text-brand-blue" />
                        Patient Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-semibold">{booking.patientName}</span>
                        </p>
                        {booking.patientAge && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Age:</span>
                            <span className="font-semibold">{booking.patientAge} years</span>
                          </p>
                        )}
                        {booking.patientGender && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Gender:</span>
                            <span className="font-semibold capitalize">{booking.patientGender}</span>
                          </p>
                        )}
                        <p className="flex justify-between">
                          <span className="text-gray-500">Contact:</span>
                          <span className="font-semibold">{booking.contactPhone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Collection Details */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-brand-blue" />
                        Collection Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-semibold">
                            {booking.collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}
                          </span>
                        </p>
                        {booking.collectionType === 'home' && booking.address && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Address:</p>
                            <p className="text-gray-700">
                              {booking.address.street}
                              {booking.address.landmark && `, ${booking.address.landmark}`}
                              <br />
                              {booking.address.city}, {booking.address.state} - {booking.address.pincode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phlebotomist Details */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Phone size={18} className="text-brand-blue" />
                        Service Details
                      </h4>
                      {booking.assignedTo ? (
                        <div className="space-y-2 text-sm">
                          <p className="flex justify-between">
                            <span className="text-gray-500">Assigned To:</span>
                            <span className="font-semibold">{booking.assignedTo}</span>
                          </p>
                          {booking.collectorPhone && (
                            <p className="flex justify-between">
                              <span className="text-gray-500">Phone:</span>
                              <span className="font-semibold">{booking.collectorPhone}</span>
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-700 flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>Phlebotomist will be assigned soon. You'll receive confirmation via SMS/call.</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {booking.specialInstructions && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText size={16} className="text-yellow-600" />
                        Special Instructions
                      </h4>
                      <p className="text-sm text-gray-700">{booking.specialInstructions}</p>
                    </div>
                  )}

                  {/* Sample Collection Time */}
                  {booking.sampleCollectedAt && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                        <Calendar size={16} />
                        Sample collected on {new Date(booking.sampleCollectedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Cancellation/Rescheduling Info */}
                  {booking.status === 'cancelled' && booking.cancellationReason && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">Cancellation Reason</h4>
                      <p className="text-sm text-red-700">{booking.cancellationReason}</p>
                    </div>
                  )}

                  {booking.status === 'rescheduled' && booking.rescheduledFrom && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        Rescheduled from {new Date(booking.rescheduledFrom).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Booking Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Booking ID: <span className="font-mono font-semibold">{booking._id}</span>
                  </p>
                  <Link
                    to={`/my-orders`}
                    className="text-brand-blue hover:underline font-semibold text-sm flex items-center gap-1"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
