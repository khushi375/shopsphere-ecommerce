import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6 flex-1 flex flex-col justify-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <Heart size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keep track of items you love by clicking the heart button on product catalogs.
          </p>
        </div>
        <Link 
          to="/products"
          className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-8 py-3 rounded-lg text-sm transition-colors shadow-md inline-block"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow">
        <h1 className="text-xl font-extrabold tracking-tight border-b border-gray-250 dark:border-slate-750 pb-4 flex items-center gap-2">
          <Heart size={22} className="text-rose-500" /> My Wishlist
        </h1>

        <div className="divide-y divide-gray-200 dark:divide-slate-750">
          {wishlistItems.map((item) => {
            const activePrice = item.discountPrice !== null ? item.discountPrice : item.price;
            
            return (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800">
                    <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Item Details */}
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
                  </div>

                </div>

                {/* Move to Cart & Delete */}
                <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock <= 0}
                    className="bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart size={14} /> {item.stock > 0 ? 'Move to Cart' : 'Out of stock'}
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
