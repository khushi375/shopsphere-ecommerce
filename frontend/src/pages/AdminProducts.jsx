import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category !== 'All') queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/api/products?${queryParams.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching inventory products:", error);
      toast.error("Failed to load inventory products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/api/products/${id}`);
      toast.info(`Product deleted successfully.`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Title & Actions toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-display">Manage Products</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Edit, delete, and inspect catalog products in real-time.</p>
        </div>
        <Link 
          to="/admin/add-product"
          className="bg-amazon-gold hover:bg-amazon-yellowHover text-amazon-dark font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-yellow-500/10 shrink-0"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-150 dark:border-slate-750 premium-shadow flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex h-10 w-full md:max-w-md bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-amazon-gold">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 text-xs focus:outline-none bg-transparent"
          />
          <button type="submit" className="bg-gray-200 dark:bg-slate-750 hover:bg-gray-300 px-4 text-xs font-bold transition-all">Search</button>
        </form>

        {/* Category selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-bold uppercase shrink-0">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amazon-gold cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-white text-gray-800 dark:bg-slate-800 dark:text-white">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw size={24} className="animate-spin text-amazon-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-sm">No items found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-750 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4 text-center">Stock</th>
                  <th className="py-4 px-4 text-center">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-750 font-medium text-gray-750 dark:text-gray-250">
                {products.map((p) => {
                  const img = p.images?.[0] || p.image || 'https://via.placeholder.com/50';
                  const isDiscount = p.discountPrice !== null && p.discountPrice !== undefined;
                  const finalPrice = isDiscount ? p.discountPrice : p.price;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img src={img} alt={p.title} className="w-10 h-10 object-cover rounded bg-gray-50 border border-gray-200 dark:border-slate-700 shrink-0" />
                        <div>
                          <h4 className="font-bold line-clamp-1 max-w-[200px] text-gray-800 dark:text-white">{p.title}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{p.category}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold">${finalPrice.toFixed(2)}</span>
                          {isDiscount && <span className="text-[10px] text-gray-400 line-through">${p.price.toFixed(2)}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : p.stock > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-gray-800 dark:text-white">{p.rating} ★</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                            className="p-2 text-gray-400 hover:text-amazon-gold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
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

export default AdminProducts;
