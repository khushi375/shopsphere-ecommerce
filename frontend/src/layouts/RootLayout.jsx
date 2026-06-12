import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown 
} from 'lucide-react';
import { toast } from 'react-toastify';

const RootLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (category !== 'All') params.append('category', category);
    navigate(`/products?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-800'}`}>
      {/* Top Header */}
      <header className="bg-amazon-dark text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden text-gray-200 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-1.5 focus:outline-none group">
              <span className="text-2xl font-extrabold tracking-tight font-display text-white">
                Shop<span className="text-amazon-gold">Sphere</span>
              </span>
              <span className="hidden sm:inline-block text-xs text-amazon-gold font-bold self-end mb-1">.in</span>
            </Link>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-gold">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ colorScheme: 'light' }}
              className="px-3 bg-gray-100 border-r border-gray-300 text-gray-750 text-sm focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white text-gray-800">{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search ShopSphere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-800 text-sm focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark px-6 flex items-center justify-center transition-colors"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Dark Mode toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full hover:bg-amazon-light text-gray-200 hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-2 hover:bg-amazon-light rounded-md transition-colors text-gray-200 hover:text-white">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amazon-gold text-amazon-dark text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="flex items-center gap-1.5 p-2 hover:bg-amazon-light rounded-md transition-colors text-gray-200 hover:text-white group">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-1.5 -right-1.5 bg-amazon-gold text-amazon-dark text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline-block text-sm font-bold text-gray-100 self-end">Cart</span>
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {user ? (
                <div>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1 p-1 sm:p-2 hover:bg-amazon-light rounded-md text-left transition-colors focus:outline-none"
                  >
                    <div className="hidden sm:block">
                      <div className="text-[10px] text-gray-300">Hello, {user.name.split(' ')[0]}</div>
                      <div className="text-xs font-bold flex items-center gap-0.5 text-gray-100">
                        Account & Lists <ChevronDown size={12} />
                      </div>
                    </div>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-400 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amazon-gold text-amazon-dark font-extrabold flex items-center justify-center border border-gray-400 sm:hidden">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 py-1 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold"
                        >
                          <Shield size={16} /> Admin Console
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 p-2 hover:bg-amazon-light rounded-md text-gray-200 hover:text-white transition-colors">
                  <User size={20} />
                  <span className="hidden sm:inline-block text-xs font-bold">Sign In</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Amazon Sub-Navbar */}
        <div className="bg-amazon-light text-sm text-gray-200 border-t border-slate-700 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-6">
            <button 
              onClick={() => handleCategoryClick('All')}
              className="flex items-center gap-1 font-bold hover:text-white focus:outline-none"
            >
              <Menu size={18} /> All Categories
            </button>
            <nav className="flex items-center gap-6">
              {categories.filter(cat => cat !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`hover:text-white transition-colors font-medium ${selectedCategory === cat ? 'text-amazon-gold underline underline-offset-4' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile search bar */}
      <div className="bg-amazon-dark px-4 pb-3 pt-1 md:hidden">
        <form onSubmit={handleSearch} className="flex h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-gold">
          <input
            type="text"
            placeholder="Search ShopSphere..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-800 text-sm focus:outline-none"
          />
          <button type="submit" className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark px-5 flex items-center justify-center transition-colors">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Mobile Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer body */}
          <div className="relative w-72 bg-white dark:bg-slate-800 h-full flex flex-col shadow-2xl z-10 transition-transform duration-300">
            <div className="bg-amazon-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={20} className="text-amazon-gold" />
                <span className="font-bold text-md">
                  {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, Sign In'}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Shop By Category</div>
              <div className="flex flex-col mb-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-6 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${selectedCategory === cat ? 'text-amazon-gold font-bold bg-amber-500/10' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="px-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</div>
              <div className="flex flex-col">
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <ShoppingCart size={18} /> Cart
                </Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <Heart size={18} /> Wishlist
                </Link>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                      <User size={18} /> My Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Shield size={18} /> Admin Console
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-6 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors flex items-center gap-2"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-amazon-gold font-bold">
                    <User size={18} /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-amazon-dark text-gray-300 text-sm mt-auto border-t border-slate-700">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full bg-slate-800 hover:bg-slate-700 py-3 text-center text-xs font-semibold text-gray-100 transition-colors"
        >
          Back to top
        </button>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">About ShopSphere</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press Releases</a></li>
              <li><a href="#" className="hover:underline">ShopSphere Science</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">Sell on ShopSphere</a></li>
              <li><a href="#" className="hover:underline">Protect and Build Your Brand</a></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Fulfilment by ShopSphere</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">ShopSphere Care</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:underline">COVID-19 and ShopSphere</a></li>
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Your Orders</a></li>
              <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xl font-bold tracking-tight font-display text-white">
              Shop<span className="text-amazon-gold">Sphere</span>
            </span>
            <p>&copy; 2026 ShopSphere, Inc. or its affiliates. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
