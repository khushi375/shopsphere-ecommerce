import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ClipboardList, RefreshCw, Eye, EyeOff, MapPin, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to "${newStatus}"!`);
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to modify order status.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-955/20 dark:text-amber-400';
      case 'Processing': return 'bg-sky-100 text-sky-800 dark:bg-sky-955/20 dark:text-sky-400';
      case 'Shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-955/20 dark:text-purple-400';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-400';
      default: return 'bg-gray-150 text-gray-700';
    }
  };

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight font-display">Manage Orders</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inspect shipment parameters, change delivery statuses, and audit customer addresses.</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 p-2 rounded-xl flex gap-1 overflow-x-auto no-scrollbar premium-shadow">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${statusFilter === s ? 'bg-amazon-gold text-amazon-dark shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-105 dark:hover:bg-slate-700'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw size={24} className="animate-spin text-amazon-gold" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-sm">No orders matching "{statusFilter}" status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-750 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Order Info</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Recipient</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-750 font-medium text-gray-750 dark:text-gray-250">
                {filteredOrders.map((o) => {
                  const isExpanded = expandedOrder === o.id;
                  const orderDate = new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' });
                  
                  return (
                    <React.Fragment key={o.id}>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-gray-800 dark:text-white truncate max-w-[120px]">{o.id}</span>
                            <span className="text-[10px] text-gray-450 truncate max-w-[120px]">UID: {o.userId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">{orderDate}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-800 dark:text-white truncate max-w-[150px]">{o.shippingAddress?.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{o.shippingAddress?.city}</p>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-gray-800 dark:text-white">${o.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider focus:outline-none border-none cursor-pointer ${getStatusStyle(o.status)}`}
                          >
                            <option value="Pending" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Pending</option>
                            <option value="Processing" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Processing</option>
                            <option value="Shipped" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Shipped</option>
                            <option value="Delivered" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Delivered</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                            className="p-2 text-gray-400 hover:text-amazon-gold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Inspect Order Items"
                          >
                            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </td>
                      </tr>

                      {/* Dropdown Items details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-t border-b border-gray-150 dark:border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                              
                              {/* Order items checklist */}
                              <div className="space-y-2.5">
                                <h4 className="font-bold text-gray-450 uppercase tracking-wider">Order Items</h4>
                                <div className="space-y-2">
                                  {o.products?.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center gap-4 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-750">
                                      <div className="flex items-center gap-2.5">
                                        <img src={p.image || p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.title} className="w-8 h-8 object-cover rounded" />
                                        <div>
                                          <p className="font-bold text-gray-800 dark:text-white line-clamp-1">{p.title}</p>
                                          <p className="text-[10px] text-gray-450">ID: {p.id}</p>
                                        </div>
                                      </div>
                                      <span className="font-bold shrink-0">{p.quantity} x ${(p.discountPrice || p.price).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping summary details */}
                              <div className="space-y-2.5">
                                <h4 className="font-bold text-gray-450 uppercase tracking-wider flex items-center gap-1"><MapPin size={12} /> Delivery Address</h4>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-750 text-gray-650 dark:text-gray-350">
                                  <p className="font-bold text-gray-800 dark:text-white mb-1">{o.shippingAddress?.name}</p>
                                  <p>{o.shippingAddress?.addressLine}</p>
                                  <p>{o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}</p>
                                  <p>{o.shippingAddress?.country}</p>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminOrders;
