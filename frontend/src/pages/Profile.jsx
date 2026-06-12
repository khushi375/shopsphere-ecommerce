import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Calendar, User, Package, ChevronDown, ChevronUp, MapPin, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await api.get('/api/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
        toast.error("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/35 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50';
      case 'Processing': return 'bg-sky-100 text-sky-800 dark:bg-sky-950/35 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50';
      case 'Shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/35 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300 border border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex-grow flex flex-col md:flex-row gap-8 w-full">
      
      {/* Left: User account parameters */}
      <section className="w-full md:w-80 shrink-0">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-6 text-center">
          <div className="flex flex-col items-center">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-amazon-gold object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-amazon-gold text-amazon-dark font-black text-3xl flex items-center justify-center border-4 border-amazon-gold shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="font-extrabold text-lg mt-4">{user?.name}</h2>
            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border mt-1.5 flex items-center gap-1 ${user?.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-slate-900'}`}>
              {user?.role === 'admin' && <Shield size={12} />}
              {user?.role} Account
            </span>
          </div>

          <hr className="border-gray-200 dark:border-slate-700" />

          <div className="text-left space-y-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase">Email Address</span>
              <p className="font-bold truncate text-gray-750 dark:text-gray-200">{user?.email}</p>
            </div>
            
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase flex items-center gap-1">
                <Calendar size={14} /> Created At
              </span>
              <p className="font-bold text-gray-750 dark:text-gray-200">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Demo Simulation Session'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Order history */}
      <section className="flex-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow">
          <h1 className="text-xl font-extrabold tracking-tight border-b border-gray-250 dark:border-slate-750 pb-4 flex items-center gap-2">
            <Package size={22} className="text-amazon-gold" /> Order History
          </h1>

          {loading ? (
            <div className="py-12 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-750">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' });
                
                return (
                  <div key={order.id} className="py-5 space-y-4">
                    {/* Header Summary bar */}
                    <div 
                      onClick={() => toggleOrderExpand(order.id)}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750/30 p-2.5 rounded-lg transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono block">Order ID: {order.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold">{orderDate}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm font-black text-gray-800 dark:text-white">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Detailed Dropdown section */}
                    {isExpanded && (
                      <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-xl p-4 sm:p-6 space-y-4 animate-fade-in text-xs">
                        
                        {/* Products checklist */}
                        <div className="space-y-3">
                          <h4 className="font-extrabold text-gray-500 uppercase">Items Purchased</h4>
                          <div className="divide-y divide-gray-200 dark:divide-slate-800">
                            {order.products.map((p, idx) => {
                              const activePrice = p.discountPrice !== null && p.discountPrice !== undefined ? p.discountPrice : p.price;
                              
                              return (
                                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <img src={p.image || p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.title} className="w-10 h-10 object-cover rounded bg-gray-250 border" />
                                    <div>
                                      <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{p.title}</p>
                                      <p className="text-gray-400 text-[10px]">Qty: {p.quantity} @ ${activePrice.toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <span className="font-bold">${(activePrice * p.quantity).toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Shipping Address review */}
                        <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-slate-800">
                          <h4 className="font-extrabold text-gray-500 uppercase flex items-center gap-1"><MapPin size={12} /> Shipping Address</h4>
                          <div className="text-gray-650 dark:text-gray-300 font-medium">
                            <p className="font-bold text-gray-800 dark:text-gray-200">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.addressLine}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Profile;
