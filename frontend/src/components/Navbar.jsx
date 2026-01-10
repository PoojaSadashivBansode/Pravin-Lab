/**
 * ===========================================
 *        NAVBAR COMPONENT - Navigation Bar
 * ===========================================
 * 
 * Main navigation component with:
 * - Logo and navigation links
 * - User profile dropdown (auth-aware)
 * - Mobile responsive drawer
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Menu, X, User, FileText, Calendar, LogOut, ChevronDown, LogIn, UserPlus, Settings, ShoppingCart } from "lucide-react"; 
import logo from "../assets/Logo1.png";

/**
 * Navbar Component
 * 
 * Displays navigation links and user profile dropdown.
 * Automatically shows login/register or user info based on auth state.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Get auth state from context
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation(); 
  const navigate = useNavigate();

  // Navigation links configuration
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tests", path: "/tests" },
    { name: "Packages", path: "/packages" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  /**
   * Handle Logout
   * Logs out user and shows success toast
   */
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  /**
   * Get user initials for avatar
   * @returns {String} First letter(s) of user's name
   */
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <img src={logo} alt="Lab Logo" className="h-18 w-auto object-contain" />
          </Link>

          {/* RIGHT: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`group relative py-1 text-[15px] font-semibold transition-colors duration-300
                      ${isActive ? 'text-brand-red' : 'text-text-primary hover:text-brand-blue'}`}
                  >
                    {link.name}
                    <span className={`absolute left-0 -bottom-0.5 h-0.5 transition-all duration-300
                        ${isActive ? 'w-full bg-brand-red' : 'w-0 group-hover:w-full '}`}
                    ></span>
                  </Link>
                );
              })}
            </div>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingCart size={24} className="text-gray-700" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* --- PROFILE DROPDOWN START --- */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md transition-all active:scale-95 bg-white"
              >
                {/* User Avatar */}
                {isAuthenticated && user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isAuthenticated ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm' : 'bg-gray-50 text-gray-400'}`}>
                    {isAuthenticated ? getUserInitials() : <User size={20} />}
                  </div>
                )}
                
                {/* User Name / Login Text */}
                <div className="text-left hidden lg:block mr-1">
                  <p className="text-[12px] font-bold text-gray-700 leading-none">
                    {loading ? "Loading..." : (isAuthenticated ? user?.name?.split(" ")[0] : "Login")}
                  </p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                    
                    {isAuthenticated ? (
                      /* LOGGED IN VIEW */
                      <>
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Portal</p>
                          <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium"
                        >
                          <User size={16} /> My Profile
                        </Link>
                        <Link 
                          to="/reports" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium"
                        >
                          <FileText size={16} /> My Reports
                        </Link>
                        <Link 
                          to="/bookings" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium"
                        >
                          <Calendar size={16} /> My Bookings
                        </Link>

                        {/* Admin Link (only for admin users) */}
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsProfileOpen(false)} 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium"
                          >
                            <Settings size={16} /> Admin Panel
                          </Link>
                        )}

                        {/* Logout Button */}
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-red font-bold hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      /* LOGGED OUT (GUEST) VIEW */
                      <>
                        <div className="px-4 py-3 mb-1">
                          <p className="text-sm font-bold text-text-primary">Welcome Guest</p>
                          <p className="text-[11px] text-gray-500">Access your reports and health data.</p>
                        </div>
                        <div className="px-3 pb-2">
                          <Link 
                            to="/login" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-md hover:bg-brand-blue-hover transition-all active:scale-95"
                          >
                            <LogIn size={16} /> Login
                          </Link>
                        </div>
                        <Link 
                          to="/register" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                          <UserPlus size={16} className="text-gray-400" /> New Patient? <span className="text-brand-blue font-bold">Register</span>
                        </Link>
                      </>
                    )}
                  </div>
                  {/* Backdrop to close dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                </>
              )}
            </div>
            {/* --- PROFILE DROPDOWN END --- */}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-brand-red px-6 py-6 space-y-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-semibold ${location.pathname === link.path ? 'text-brand-red' : 'text-text-primary'}`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Auth Section */}
          <div className="pt-4 border-t border-gray-100">
             {isAuthenticated ? (
               <>
                 {/* User Info */}
                 <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                   {user?.profileImage ? (
                     <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center">
                       {getUserInitials()}
                     </div>
                   )}
                   <div>
                     <p className="font-bold text-gray-800">{user?.name}</p>
                     <p className="text-xs text-gray-500">{user?.email}</p>
                   </div>
                 </div>

                 {/* Menu Links */}
                 <Link to="/profile" className="block text-lg font-semibold text-gray-600 mb-3" onClick={() => setIsOpen(false)}>
                   My Profile
                 </Link>
                 <Link to="/reports" className="block text-lg font-semibold text-gray-600 mb-3" onClick={() => setIsOpen(false)}>
                   My Reports
                 </Link>
                 <Link to="/bookings" className="block text-lg font-semibold text-gray-600 mb-4" onClick={() => setIsOpen(false)}>
                   My Bookings
                 </Link>

                 {/* Admin Link */}
                 {user?.role === 'admin' && (
                   <Link to="/admin" className="block text-lg font-semibold text-gray-600 mb-4" onClick={() => setIsOpen(false)}>
                     Admin Panel
                   </Link>
                 )}

                 {/* Logout */}
                 <button onClick={handleLogout} className="text-lg font-bold text-brand-red">
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link 
                   to="/login" 
                   onClick={() => setIsOpen(false)} 
                   className="block text-lg font-bold text-brand-blue mb-3"
                 >
                   Login
                 </Link>
                 <Link 
                   to="/register" 
                   onClick={() => setIsOpen(false)} 
                   className="block text-lg font-semibold text-gray-600"
                 >
                   Register
                 </Link>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;