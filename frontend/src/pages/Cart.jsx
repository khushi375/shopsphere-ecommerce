import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6 flex-1 flex flex-col justify-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amazon-gold flex items-center justify-center mx-auto">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven't added any items to your shopping cart yet. Let's find some deals!
          </p>
        </div>
        <Link 
          to="/products"
          className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-8 py-3 rounded-lg text-sm transition-colors shadow-md inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex flex-col lg:flex-row gap-8">
      
      {/* Left: Cart Items List */}
      <section className="flex-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow">
          <h1 className="text-xl font-extrabold tracking-tight border-b border-gray-250 dark:border-slate-750 pb-4">
            Shopping Cart
          </h1>
          
          <div className="divide-y divide-gray-200 dark:divide-slate-750">
            {cartItems.map((item) => {
              const activePrice = item.discountPrice !== null ? item.discountPrice : item.price;
              const subtotal = activePrice * item.quantity;
              
              return (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800">
                      <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Title & Price */}
                    <div>
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 hover:text-amazon-gold transition-colors">
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-extrabold">${activePrice.toFixed(2)}</span>
                        {item.discountPrice !== null && (
                          <span className="text-xs text-gray-400 line-through">${item.price.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Stock limit: {item.stock}</span>
                    </div>

                  </div>

                  {/* Quantity Actions & Remove */}
                  <div className="flex items-center gap-6 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900 h-8">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 hover:bg-gray-200 dark:hover:bg-slate-850 font-bold transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-extrabold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 hover:bg-gray-200 dark:hover:bg-slate-850 font-bold transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <span className="text-sm font-black text-gray-800 dark:text-white hidden sm:inline-block w-20 text-right">
                      ${subtotal.toFixed(2)}
                    </span>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right: Cart Summary */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-6">
          <h3 className="font-extrabold text-base border-b border-gray-250 dark:border-slate-750 pb-3">
            Order Summary
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal ({cartCount} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {cartTotal >= 100 ? 'FREE' : '$10.00'}
              </span>
            </div>
            
            <hr className="border-gray-200 dark:border-slate-700" />
            
            <div className="flex justify-between text-base font-extrabold">
              <span>Order Total</span>
              <span>
                ${(cartTotal >= 100 ? cartTotal : cartTotal + 10).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm shadow-yellow-500/10 group"
          >
            Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Shipping eligibility and items checkout status are subject to terms of service. Secure transactions protected.
          </p>
        </div>
      </aside>

    </div>
  );
};

export default Cart;
