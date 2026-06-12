import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingCart, Heart, ArrowRight, Star, Tag, Award, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: "Unleash Ultimate Sound",
      subtitle: "Up to 30% Off Vortex Pro Audio Gear",
      description: "Dive into pure high-fidelity audio with our new noise-cancelling headphones and studio grade accessories.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
      link: "/products?category=Electronics",
      buttonText: "Shop Audio Deals"
    },
    {
      title: "Elevate Your Mobile World",
      subtitle: "New OLED Screen Smartphones In Stock",
      description: "Upgrade your hardware with dynamic displays, advanced telephoto cameras, and unmatched gaming performance.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
      link: "/products?category=Electronics",
      buttonText: "Discover Smartphones"
    },
    {
      title: "Home Brewing Redefined",
      subtitle: "Barista-Quality Espresso at Your Fingertips",
      description: "Bring the cafe home with programmable touchscreen temperature controllers and powerful frothing wands.",
      image: "https://i.pinimg.com/1200x/53/57/3c/53573c345b85d26d19230a22c8a9bf66.jpg",
      link: "/products?category=Home",
      buttonText: "Browse Espresso Makers"
    }
  ];

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&auto=format&fit=crop&q=80' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80' },
    { name: 'Home', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80' },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&auto=format&fit=crop&q=80' }
  ];

  // Default placeholder catalog items in case server db is unseeded
  const fallbackProducts = [
    {
      id: 'vortex-earbuds',
      title: "Vortex Wireless ANC Earbuds",
      description: "True wireless earbuds with active noise cancellation.",
      category: "Electronics",
      price: 129.99,
      discountPrice: 99.99,
      stock: 40,
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80"]
    },
    {
      id: 'quantum-phone',
      title: "Quantum 6.7\" OLED Smartphone",
      description: "A state-of-the-art smartphone featuring a 120Hz refresh OLED display.",
      category: "Electronics",
      price: 999.99,
      discountPrice: 899.99,
      stock: 15,
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80"]
    },
    {
      id: 'leather-wallet',
      title: "Heritage Slim Leather Wallet",
      description: "Handcrafted from full-grain vegetable-tanned leather.",
      category: "Fashion",
      price: 39.99,
      discountPrice: 29.99,
      stock: 35,
      rating: 4.6,
      images: ["https://images.unsplash.com/photo-1627124718515-e222909fcc65?w=400&auto=format&fit=crop&q=80"]
    },
    {
      id: 'espresso-maker',
      title: "BrewMaster Thermal Espresso Maker",
      description: "Brew barista-quality espresso at home with 19-bar pressure extraction.",
      category: "Home",
      price: 299.99,
      discountPrice: 249.99,
      stock: 12,
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=400&auto=format&fit=crop&q=80"]
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/api/products');
        if (response.data && response.data.length > 0) {
          setProducts(response.data.slice(0, 8)); // Grab up to 8 products
        } else {
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.warn("Home page products API failed, loading local fallback data:", error.message);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
    
    // Auto shift hero slides
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Carousel */}
      <section className="relative h-[480px] w-full overflow-hidden bg-slate-950">
        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            
            {/* Slide Content */}
            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center text-white space-y-4 md:space-y-6">
              <span className="text-amazon-gold font-black uppercase tracking-widest text-xs md:text-sm bg-amazon-light/60 px-3 py-1 rounded-full w-max">
                {slide.subtitle}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight max-w-xl">
                {slide.title}
              </h1>
              <p className="text-gray-300 max-w-lg text-sm md:text-base leading-relaxed">
                {slide.description}
              </p>
              <div className="pt-2">
                <Link 
                  to={slide.link}
                  className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-6 md:px-8 py-3 rounded-md transition-all shadow-lg hover:shadow-yellow-500/20 inline-flex items-center gap-2 group text-sm md:text-base"
                >
                  {slide.buttonText} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex gap-2.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border border-white/40 ${idx === heroIndex ? 'bg-amazon-gold w-8 border-transparent' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 -mt-20 relative z-30">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-4 premium-shadow">
          <div className="p-3.5 rounded-full bg-amber-500/10 text-amazon-gold"><Truck size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Free Delivery</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">On all orders above $100</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-4 premium-shadow">
          <div className="p-3.5 rounded-full bg-amber-500/10 text-amazon-gold"><ShieldCheck size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Secure Payment</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">100% Protected Checkouts</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-4 premium-shadow">
          <div className="p-3.5 rounded-full bg-amber-500/10 text-amazon-gold"><Award size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Quality Assured</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Barista & Gamer Approved</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-4 premium-shadow">
          <div className="p-3.5 rounded-full bg-amber-500/10 text-amazon-gold"><Tag size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Daily Discounts</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Save up to 40% every day</p>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-750 pb-3">
          <h2 className="text-2xl font-extrabold tracking-tight font-display">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 rounded-xl overflow-hidden hover:shadow-lg transition-all text-center flex flex-col premium-shadow"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="py-4 font-bold text-sm group-hover:text-amazon-gold transition-colors truncate px-2">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-750 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight font-display">Featured Products</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explore our customer favorites and high rated products</p>
          </div>
          <Link to="/products" className="text-amazon-gold hover:text-amazon-yellowHover font-bold text-sm flex items-center gap-1 group">
            See All <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl h-80 animate-pulse border border-gray-100 dark:border-slate-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const activePrice = product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
              const img = product.images?.[0] || product.image || 'https://via.placeholder.com/200';
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 rounded-xl overflow-hidden flex flex-col premium-card-hover premium-shadow group relative"
                >
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-700/85 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 shadow-sm transition-transform duration-200 z-10"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Product Thumbnail */}
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

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
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
                      
                      {/* Rating stars */}
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
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold p-2.5 rounded-lg transition-colors flex items-center justify-center shadow-sm"
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

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amazon-light to-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">Join the ShopSphere Club</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Earn reward cashbacks, unlock free express shipping benefits, and get early invite-only access to lightning sales and new electronics launches.
            </p>
          </div>
          <button 
            onClick={() => navigate('/register')}
            className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-8 py-3 rounded-lg text-sm transition-colors shadow-lg shadow-yellow-500/10 shrink-0"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Trending / New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-750 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight font-display">Trending Items</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Discover popular picks trending across ShopSphere</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl h-80 animate-pulse border border-gray-100 dark:border-slate-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(4, 8).map((product) => {
              const activePrice = product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
              const img = product.images?.[0] || product.image || 'https://via.placeholder.com/200';
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-750 rounded-xl overflow-hidden flex flex-col premium-card-hover premium-shadow group relative"
                >
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-700/85 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 shadow-sm transition-transform duration-200 z-10"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

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

                  <div className="p-4 flex-1 flex flex-col justify-between">
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
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
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

      {/* Newsletter */}
      <section className="bg-gray-100 dark:bg-slate-800/50 py-12 px-4 transition-colors">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h3 className="text-xl md:text-2xl font-black font-display text-gray-800 dark:text-white">Stay in the Loop</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Subscribe to our newsletter to receive daily stock drops, category updates, and exclusive discount codes.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed successfully! Thank you.");
              e.target.reset();
            }} 
            className="flex items-stretch rounded-lg overflow-hidden border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-700 shadow-sm"
          >
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-grow px-4 py-2 text-sm text-gray-800 dark:text-white dark:placeholder-gray-400 bg-transparent focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-6 text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
