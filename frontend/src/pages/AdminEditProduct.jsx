import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Plus, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    price: '',
    discountPrice: '',
    stock: '',
    rating: '5.0'
  });
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        const p = response.data.product;
        setFormData({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'Electronics',
          price: p.price !== undefined ? p.price.toString() : '',
          discountPrice: p.discountPrice !== null && p.discountPrice !== undefined ? p.discountPrice.toString() : '',
          stock: p.stock !== undefined ? p.stock.toString() : '',
          rating: p.rating !== undefined ? p.rating.toString() : '5.0'
        });
        setImages(p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []));
      } catch (error) {
        console.error("Error loading product for editing:", error);
        toast.error("Failed to load product details.");
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
      toast.success("Image URL added to gallery.");
    }
  };

  const removeImage = (indexToRemove) => {
    if (images.length === 1) {
      toast.warning("Product must have at least one cover image.");
      return;
    }
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating) || 5.0,
        images
      };

      await api.put(`/api/products/${id}`, payload);
      toast.success(`Product "${formData.title}" updated successfully!`);
      navigate('/admin/products');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <RefreshCw size={28} className="animate-spin text-amazon-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/admin/products')}
        className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center gap-1.5 font-bold"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      {/* Editing Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-6 text-xs font-semibold">
        <h1 className="text-xl font-extrabold tracking-tight border-b border-gray-250 dark:border-slate-750 pb-4">
          Edit Product Info
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-gray-400 font-bold uppercase">Product Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-gray-400 font-bold uppercase">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full h-10 px-3 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white cursor-pointer font-bold"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white text-gray-800 dark:bg-slate-800 dark:text-white">{cat}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase">Avg. Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              step="0.1"
              min="1.0"
              max="5.0"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase">Regular Price ($) *</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              min="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>

          {/* Discount Price */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase">Discounted Price ($)</label>
            <input
              type="number"
              name="discountPrice"
              step="0.01"
              min="0.00"
              value={formData.discountPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase">Available Inventory Stock *</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Gallery URLs */}
        <div className="space-y-3 pt-4 border-t border-gray-150 dark:border-slate-700">
          <label className="text-gray-400 font-bold uppercase block">Product Image Gallery</label>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add photo link URL (e.g. Unsplash URL)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amazon-gold text-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-slate-200 hover:bg-slate-350 dark:bg-slate-700 dark:hover:bg-slate-655 px-4 rounded-lg flex items-center gap-1 shrink-0 font-bold"
            >
              <Plus size={16} /> Add URL
            </button>
          </div>

          {/* Gallery display preview */}
          <div className="flex gap-3 flex-wrap pt-2">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shrink-0 bg-gray-100">
                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:scale-105 animate-fade-in"
                  title="Remove Image"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-150 dark:border-slate-700">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shadow-yellow-500/10"
          >
            <Save size={16} /> {saving ? 'Saving updates...' : 'Save Product Updates'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminEditProduct;
