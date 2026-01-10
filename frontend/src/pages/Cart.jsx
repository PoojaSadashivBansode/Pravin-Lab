import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, ArrowRight, Package as PackageIcon, TestTube } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal, getSavings } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] py-12 sm:py-16 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Start adding tests and packages to your cart</p>
          <div className="flex gap-4 justify-center">
            <Link to="/tests" className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              Browse Tests
            </Link>
            <Link to="/packages" className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
              Browse Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">{cartItems.length} item(s) in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`${item.type === 'test' ? 'bg-red-50' : 'bg-blue-50'} p-3 rounded-full h-fit`}>
                    {item.type === 'test' ? (
                      <TestTube className={`${item.type === 'test' ? 'text-brand-red' : 'text-brand-blue'}`} size={24} />
                    ) : (
                      <PackageIcon className="text-brand-blue" size={24} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.type === 'test' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {item.type === 'test' ? 'Test' : 'Package'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                      >
                        <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {item.category && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Category:</span> {item.category}
                        </span>
                      )}
                      {item.reportTime && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Report:</span> {item.reportTime}
                        </span>
                      )}
                      {item.testsCount && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Tests:</span> {item.testsCount}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-2xl font-black text-brand-red">₹{item.price}</span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-gray-400 line-through">₹{item.originalPrice}</span>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                            Save ₹{item.originalPrice - item.price}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{getCartTotal() + getSavings()}</span>
                </div>
                {getSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-semibold">-₹{getSavings()}</span>
                  </div>
                )}
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-brand-red">₹{getCartTotal()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free Home Sample Collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Digital Reports in 24-48 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>NABL Certified Lab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
