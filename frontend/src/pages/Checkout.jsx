import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Check, Calendar, Home, MapPin, CreditCard, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../context/AuthContext';
import QRCode from 'qrcode';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [formData, setFormData] = useState({
    // Patient Details
    patientName: user?.name || '',
    patientAge: '',
    patientGender: '',
    contactPhone: user?.phone || '',
    
    // Collection Details
    collectionType: 'home',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    preferredDate: '',
    preferredTimeSlot: '',
    
    // Payment
    paymentMethod: 'cod',
    specialInstructions: ''
  });

  const timeSlots = [
    '6:00 AM - 8:00 AM',
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.patientName || !formData.patientAge || !formData.patientGender || !formData.contactPhone) {
        toast.error('Please fill all patient details');
        return false;
      }
    } else if (step === 2) {
      if (formData.collectionType === 'home') {
        if (!formData.address.street || !formData.address.city || !formData.address.pincode) {
          toast.error('Please fill complete address');
          return false;
        }
      }
      if (!formData.preferredDate || !formData.preferredTimeSlot) {
        toast.error('Please select date and time slot');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const generateUPIQR = async () => {
    const upiString = `upi://pay?pa=lab@upi&pn=PravinLab&am=${getCartTotal()}&cu=INR&tn=Lab Test Payment`;
    try {
      const url = await QRCode.toDataURL(upiString);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (formData.paymentMethod === 'online' && !qrCodeUrl) {
      await generateUPIQR();
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        tests: cartItems.filter(item => item.type === 'test').map(item => ({
          test: item.id,
          name: item.name,
          price: item.originalPrice,
          discountPrice: item.price
        })),
        packages: cartItems.filter(item => item.type === 'package').map(item => ({
          package: item.id,
          name: item.name,
          price: item.originalPrice,
          discountPrice: item.price
        })),
        subtotal: getCartTotal(),
        discountAmount: 0,
        totalAmount: getCartTotal(),
        collectionType: formData.collectionType,
        collectionAddress: formData.address,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions
      };

      const res = await api.post('/orders', orderData);
      
      if (res.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${res.data.data._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, name: 'Patient Details', icon: FileText },
    { number: 2, name: 'Collection Details', icon: Calendar },
    { number: 3, name: 'Payment', icon: CreditCard },
    { number: 4, name: 'Review', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-brand-blue hover:underline mb-6">
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8">Complete your booking in {steps.length} easy steps</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step.number ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.number ? <Check size={20} /> : step.number}
                </div>
                <p className={`text-xs mt-2 font-semibold ${currentStep >= step.number ? 'text-brand-blue' : 'text-gray-400'}`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Step 1: Patient Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Collection Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Details</h2>
              
              {/* Collection Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Collection Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, collectionType: 'home' }))}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      formData.collectionType === 'home' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Home className={formData.collectionType === 'home' ? 'text-brand-blue' : 'text-gray-400'} />
                    <div className="text-left">
                      <p className="font-bold">Home Collection</p>
                      <p className="text-xs text-gray-500">Free sample collection</p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, collectionType: 'lab' }))}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      formData.collectionType === 'lab' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className={formData.collectionType === 'lab' ? 'text-brand-blue' : 'text-gray-400'} />
                    <div className="text-left">
                      <p className="font-bold">Visit Lab</p>
                      <p className="text-xs text-gray-500">Walk-in anytime</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Address (only for home collection) */}
              {formData.collectionType === 'home' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Address *</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot *</label>
                  <select
                    name="preferredTimeSlot"
                    value={formData.preferredTimeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions (Optional)</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                  placeholder="Any special instructions for sample collection..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`w-full p-6 border-2 rounded-xl flex items-center justify-between transition-all ${
                    formData.paymentMethod === 'cod' ? 'border-brand-blue bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'cod' ? 'border-brand-blue' : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when sample is collected</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online' }))}
                  className={`w-full p-6 border-2 rounded-xl flex items-center justify-between transition-all ${
                    formData.paymentMethod === 'online' ? 'border-brand-blue bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'online' ? 'border-brand-blue' : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'online' && <div className="w-3 h-3 rounded-full bg-brand-blue"></div>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Online Payment (UPI)</p>
                      <p className="text-sm text-gray-500">Pay via UPI using QR code</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* QR Code Display */}
              {formData.paymentMethod === 'online' && qrCodeUrl && (
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <h3 className="font-bold text-gray-800 mb-4">Scan QR to Pay</h3>
                  <img src={qrCodeUrl} alt="UPI QR Code" className="mx-auto w-64 h-64 border-4 border-white rounded-lg shadow-lg" />
                  <p className="text-sm text-gray-600 mt-4">Amount: ₹{getCartTotal()}</p>
                  <p className="text-xs text-gray-500 mt-2">After payment, click "Confirm Payment" below</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Order</h2>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-semibold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-brand-red">₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Patient & Collection Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-3">Patient Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {formData.patientName}</p>
                    <p><span className="text-gray-500">Age:</span> {formData.patientAge} years</p>
                    <p><span className="text-gray-500">Gender:</span> {formData.patientGender}</p>
                    <p><span className="text-gray-500">Phone:</span> {formData.contactPhone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-3">Collection Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Type:</span> {formData.collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}</p>
                    <p><span className="text-gray-500">Date:</span> {formData.preferredDate}</p>
                    <p><span className="text-gray-500">Time:</span> {formData.preferredTimeSlot}</p>
                    <p><span className="text-gray-500">Payment:</span> {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (UPI)'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="ml-auto flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
                <Check size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
