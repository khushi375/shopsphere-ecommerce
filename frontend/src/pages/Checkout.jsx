import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CreditCard, Truck, ClipboardList, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Address form fields
  const [address, setAddress] = useState({
    name: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const finalTotal = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    
    setLoading(true);
    try {
      // API call to submit the order in backend
      const response = await api.post('/api/orders', {
        items: cartItems,
        totalAmount: finalTotal,
        shippingAddress: address
      });

      toast.success("Order placed successfully!");
      clearCart(); // Clear cart state
      navigate('/profile'); // Redirect to profile order history
    } catch (error) {
      console.error("Error checking out:", error);
      const serverError = error.response?.data?.error || "Transaction checkout failed. Please check stock or inputs.";
      toast.error(serverError);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold">Nothing to Checkout</h3>
        <p className="text-sm text-gray-500">Add items to your cart before proceeding to checkout.</p>
        <button onClick={() => navigate('/products')} className="bg-amazon-gold text-amazon-dark px-6 py-2 rounded font-bold">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex flex-col lg:flex-row gap-8">
      
      {/* Left: Address Delivery Info Form */}
      <section className="flex-1">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-6">
          <h1 className="text-xl font-extrabold tracking-tight border-b border-gray-250 dark:border-slate-750 pb-4 flex items-center gap-2">
            <Truck size={22} className="text-amazon-gold" /> Delivery Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Recipient Name</label>
              <input
                type="text"
                name="name"
                required
                value={address.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
              <input
                type="text"
                name="addressLine"
                required
                value={address.addressLine}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">City</label>
              <input
                type="text"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">State / Province / Region</label>
              <input
                type="text"
                name="state"
                required
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">ZIP / Postal Code</label>
              <input
                type="text"
                name="postalCode"
                required
                value={address.postalCode}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
              <input
                type="text"
                name="country"
                required
                value={address.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 dark:border-slate-700 space-y-4">
            <h2 className="text-sm font-extrabold flex items-center gap-2">
              <CreditCard size={18} className="text-amazon-gold" /> Payment Simulator
            </h2>
            <div className="p-4 bg-amber-500/5 border border-amazon-gold/20 rounded-lg text-xs leading-relaxed text-gray-600 dark:text-gray-450">
              <span className="font-bold text-amazon-gold block mb-1">Sandbox Environment</span>
              This order will execute a simulation checkout against your Firestore account database. No real credit cards or funds are captured.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm shadow-yellow-500/10"
          >
            {loading ? 'Validating Order Stock & Capturing...' : 'Place Your Simulated Order'}
          </button>
        </form>
      </section>

      {/* Right: Checkout Summary */}
      <aside className="w-full lg:w-96 shrink-0 space-y-6">
        
        {/* Order review */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-4">
          <h3 className="font-extrabold text-base border-b border-gray-200 dark:border-slate-750 pb-3 flex items-center gap-2">
            <ClipboardList size={18} className="text-gray-400" /> Review Items
          </h3>
          
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-750 pr-2">
            {cartItems.map(item => {
              const activePrice = item.discountPrice !== null ? item.discountPrice : item.price;
              
              return (
                <div key={item.id} className="py-3 flex gap-3 items-center justify-between text-xs">
                  <div className="flex gap-2.5 items-center">
                    <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.title} className="w-10 h-10 object-cover rounded bg-gray-50 border" />
                    <div>
                      <h4 className="font-bold line-clamp-1 max-w-[150px]">{item.title}</h4>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold">${(activePrice * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing aggregates */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-4">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Items Total ({cartItems.length})</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 font-bold">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <hr className="border-gray-150 dark:border-slate-750" />
            <div className="flex justify-between text-sm font-black">
              <span>Final Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-400">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Fully secured SSL transaction processing.</span>
          </div>
        </div>

      </aside>

    </div>
  );
};

export default Checkout;
