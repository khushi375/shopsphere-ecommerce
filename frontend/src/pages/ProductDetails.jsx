import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingCart, Heart, Star, ShieldCheck, RefreshCcw, Truck, MessageSquare, Award } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Simulated reviews generator to guarantee no empty placeholders
  const mockReviews = [
    { id: 1, author: "John D.", rating: 5, date: "May 24, 2026", title: "Incredible Quality!", text: "Exceeded my expectations. The details and finish feel extremely high quality, and it functions perfectly. Will buy again from ShopSphere!" },
    { id: 2, author: "Sarah M.", rating: 4, date: "June 02, 2026", title: "Excellent product, fast shipping", text: "Overall very satisfied. The packing was extremely neat, shipping took just 2 days. Highly functional and premium design." },
    { id: 3, author: "David K.", rating: 5, date: "June 10, 2026", title: "Worth every penny", text: "Premium item that fits description perfectly. Hard to find things built this well nowadays. 5/5 stars." }
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts || []);
        setActiveImage(response.data.product.images?.[0] || response.data.product.image || 'https://via.placeholder.com/400');
        setQuantity(1);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Product not found or database offline.");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white dark:bg-slate-800 h-96 rounded-xl border border-gray-100 dark:border-slate-700" />
          <div className="md:w-1/2 space-y-4">
            <div className="h-6 w-1/4 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-10 w-3/4 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-6 w-1/3 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-24 w-full bg-gray-300 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 flex-1">
      
      {/* Product View */}
      <section className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow">
        
        {/* Left: Image Gallery */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="w-full h-80 md:h-[400px] bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 flex items-center justify-center relative">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}
          </div>
          
          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 bg-gray-50 dark:bg-slate-900 transition-all ${activeImage === img ? 'border-amazon-gold shadow-md scale-102' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details Info */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category tag */}
            <span className="text-[10px] bg-amber-500/10 text-amazon-gold px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest border border-amazon-gold/20">
              {product.category}
            </span>
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">{product.title}</h1>
            
            {/* Ratings summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className="inline" 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-bold">{product.rating} ★</span>
              <span className="text-gray-300 dark:text-slate-600">|</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold flex items-center gap-1">
                <MessageSquare size={14} /> {mockReviews.length} Reviews
              </span>
            </div>

            <hr className="border-gray-200 dark:border-slate-700" />

            {/* Price display */}
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Price</span>
              {hasDiscount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gray-800 dark:text-white">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-gray-800 dark:text-white">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Stock details */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Status:</span>
              <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-full text-xs ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Temporarily Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Product Description</span>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

          </div>

          <div className="space-y-4 pt-4 border-t border-gray-250 dark:border-slate-750">
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Quantity</span>
                <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900 h-9">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 hover:bg-gray-200 dark:hover:bg-slate-800 font-bold transition-colors focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-extrabold text-gray-700 dark:text-gray-200">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 hover:bg-gray-200 dark:hover:bg-slate-800 font-bold transition-colors focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm shadow-yellow-500/10"
              >
                <ShoppingCart size={18} /> Add to Shopping Cart
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3.5 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 text-sm ${isInWishlist(product.id) ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-350 dark:border-slate-600 dark:hover:bg-slate-700'}`}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                {isInWishlist(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Related Products Scroll */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold font-display">Related Products</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar">
            {relatedProducts.map(item => {
              const itemPrice = item.discountPrice !== null && item.discountPrice !== undefined ? item.discountPrice : item.price;
              
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-56 shrink-0 bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 rounded-xl overflow-hidden p-3 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between premium-shadow group"
                >
                  <div className="h-36 bg-gray-100 dark:bg-slate-750 rounded-lg overflow-hidden mb-3">
                    <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs truncate text-gray-800 dark:text-white group-hover:text-amazon-gold transition-colors">{item.title}</h4>
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] text-gray-500 font-bold">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black text-sm">${itemPrice.toFixed(2)}</span>
                    <span className="text-[9px] font-bold text-emerald-600">{item.stock > 0 ? 'In Stock' : 'Out of stock'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Reviews Tab */}
      <section className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 p-6 md:p-8 rounded-2xl premium-shadow space-y-6">
        <h3 className="text-lg font-extrabold font-display flex items-center gap-2">
          Customer Reviews ({mockReviews.length})
        </h3>
        
        <div className="space-y-6">
          {mockReviews.map((rev) => (
            <div key={rev.id} className="space-y-2 border-b border-gray-100 dark:border-slate-750 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                    {rev.author.charAt(0)}
                  </div>
                  <span className="text-xs font-extrabold">{rev.author}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-xs font-bold ml-1">{rev.title}</span>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.text}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetails;
