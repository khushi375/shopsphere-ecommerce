import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  ClipboardList, 
  Users, 
  Home, 
  Menu, 
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If user role is not admin, deny access and show nice error layout
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl max-w-md text-center border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You do not have the administrative privileges required to access the Admin Console.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold py-2 px-6 rounded-md transition-all shadow-md"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Add Product', path: '/admin/add-product', icon: <PlusCircle size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/add-product') return 'Add Product';
    if (path.startsWith('/admin/edit-product')) return 'Edit Product';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/users') return 'Users';
    return 'Admin';
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800 text-white shadow-xl shrink-0">
        <div className="p-6 bg-slate-900 border-b border-slate-750 flex items-center">
          <Link to="/admin" className="text-xl font-black tracking-wider font-display">
            ShopSphere <span className="text-amazon-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-amazon-gold text-amazon-dark shadow-md' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Home size={18} /> Storefront
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors text-left w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Layout Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay background */}
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          
          <aside className="relative flex flex-col w-64 bg-slate-800 text-white h-full shadow-2xl z-10">
            <div className="p-6 bg-slate-900 flex items-center justify-between border-b border-slate-750">
              <span className="text-xl font-black font-display">ShopSphere <span className="text-amazon-gold font-black">Admin</span></span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-amazon-gold text-amazon-dark shadow-md' 
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <Link 
                to="/" 
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
              >
                <Home size={18} /> Storefront
              </Link>
              <button 
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors text-left w-full"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main body wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header toolbar */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-250 dark:border-slate-750 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-gray-500 dark:text-gray-400">Admin Console</span>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-gray-800 dark:text-white font-bold">
                {getCurrentPageName()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Administrator</p>
              <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{user.name}</p>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Admin profile" className="w-9 h-9 rounded-full border-2 border-amazon-gold object-cover shadow-sm" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-amazon-gold text-amazon-dark font-black flex items-center justify-center border-2 border-amazon-gold shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
