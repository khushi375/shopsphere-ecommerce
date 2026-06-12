import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingCart, Heart, Star, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // API states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state from query parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const minPriceFilter = searchParams.get('minPrice') || '';
  const maxPriceFilter = searchParams.get('maxPrice') || '';
  const ratingFilter = searchParams.get('minRating') || '';
  const sortFilter = searchParams.get('sortBy') || 'newest';

  // Local inputs before applying
  const [localMinPrice, setLocalMinPrice] = useState(minPriceFilter);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceFilter);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (categoryFilter && categoryFilter !== 'All') queryParams.append('category', categoryFilter);
        if (minPriceFilter) queryParams.append('minPrice', minPriceFilter);
        if (maxPriceFilter) queryParams.append('maxPrice', maxPriceFilter);
        if (ratingFilter) queryParams.append('minRating', ratingFilter);
        if (sortFilter) queryParams.append('sortBy', sortFilter);

        const response = await api.get(`/api/products?${queryParams.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        toast.error("Failed to load products from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchParams]);

  // Keep local prices in sync if params change from outside
  useEffect(() => {
    setLocalMinPrice(minPriceFilter);
    setLocalMaxPrice(maxPriceFilter);
  }, [minPriceFilter, maxPriceFilter]);

  const applyFilters = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    
    // Merge updates
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });

    setSearchParams(nextParams);
    setMobileFiltersOpen(false);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    applyFilters({
      minPrice: localMinPrice,
      maxPrice: localMaxPrice
    });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalMinPrice('');
    setLocalMaxPrice('');
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const ratingTiers = [
    { label: '4★ & Above', value: '4' },
    { label: '3★ & Above', value: '3' },
    { label: '2★ & Above', value: '2' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8">
      
      {/* Filters Sidebar - Desktop */}
      <aside className="hidden md:block w-64 shrink-0 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-750 pb-3">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filters
          </h3>
          <button 
            onClick={resetFilters}
            className="text-xs text-amazon-gold hover:underline font-bold"
          >
            Clear All
          </button>
        </div>

        {/* Categories Checkbox List */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-250">Category</h4>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                <input
                  type="radio"
                  name="sidebar-category"
                  checked={categoryFilter === cat}
                  onChange={() => applyFilters({ category: cat })}
                  className="rounded-full border-gray-300 text-amazon-gold focus:ring-amazon-gold w-4 h-4"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter Form */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-250">Price Range</h4>
          <form onSubmit={handlePriceApply} className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amazon-gold"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amazon-gold"
            />
            <button
              type="submit"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-655 p-2 rounded-md font-bold text-xs transition-colors shrink-0"
            >
              Go
            </button>
          </form>
        </div>

        {/* Rating Filter List */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-250">Customer Reviews</h4>
          <div className="flex flex-col gap-2">
            {ratingTiers.map(tier => (
              <button
                key={tier.value}
                onClick={() => applyFilters({ minRating: tier.value })}
                className={`text-left text-sm flex items-center gap-2 hover:text-amazon-gold transition-colors ${ratingFilter === tier.value ? 'text-amazon-gold font-bold' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < parseInt(tier.value) ? "currentColor" : "none"} 
                      className="inline" 
                    />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Grid View */}
      <section className="flex-1 space-y-6">
        
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-750 pb-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {searchQuery ? `Search results for "${searchQuery}"` : categoryFilter !== 'All' ? `${categoryFilter} Catalog` : 'Explore All Products'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-850 rounded-md border border-gray-200 dark:border-slate-750 text-xs font-bold"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sortFilter}
                onChange={(e) => applyFilters({ sortBy: e.target.value })}
                className="bg-transparent text-gray-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Newest Arrivals</option>
                <option value="price-asc" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Avg. Customer Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 h-80 rounded-xl animate-pulse border border-gray-100 dark:border-slate-700" />
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amazon-gold flex items-center justify-center">
              <RefreshCw size={28} className="animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">No Products Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                Try widening your price range, reducing filter criteria, or checking for search typos.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-6 py-2 rounded-lg text-xs transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const activePrice = product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
              const img = product.images?.[0] || product.image || 'https://via.placeholder.com/200';
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 rounded-xl overflow-hidden flex flex-col premium-card-hover premium-shadow group relative"
                >
                  {/* Wishlist Toggle */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-700/85 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 shadow-sm transition-transform duration-200 z-10"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Image Container */}
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="h-48 bg-gray-100 dark:bg-slate-750 overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={img} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  {/* Card Description */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="font-bold text-sm text-gray-800 dark:text-gray-100 mt-2 line-clamp-2 hover:text-amazon-gold cursor-pointer transition-colors"
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex text-amber-500">
                          <Star size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{product.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-extrabold text-gray-800 dark:text-white">${activePrice.toFixed(2)}</span>
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-base font-extrabold text-gray-800 dark:text-white">${product.price.toFixed(2)}</span>
                        )}
                        <span className={`text-[10px] font-bold block ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold p-2.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Mobile Drawer Filter Menu */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="relative flex flex-col w-72 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 h-full shadow-2xl p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-750 pb-3 mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white">Close</button>
            </div>
            
            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Category</h4>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-category"
                        checked={categoryFilter === cat}
                        onChange={() => applyFilters({ category: cat })}
                        className="rounded-full border-gray-300 text-amazon-gold w-4 h-4"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Price Range</h4>
                <form onSubmit={handlePriceApply} className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 rounded-md"
                  />
                  <button type="submit" className="bg-amazon-gold text-amazon-dark px-3 py-1 rounded-md text-xs font-bold">Go</button>
                </form>
              </div>

              {/* Ratings */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm">Reviews</h4>
                <div className="flex flex-col gap-2">
                  {ratingTiers.map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => applyFilters({ minRating: tier.value })}
                      className="text-left text-sm flex items-center gap-2"
                    >
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < parseInt(tier.value) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span>& Up</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-6"
              >
                Clear All Filters
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
};

export default Products;
