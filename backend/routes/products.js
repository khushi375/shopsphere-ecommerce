const router = require('express').Router();
const { db } = require('../firebase/admin');
const { verifyToken, verifyAdmin } = require('../utils/auth');

// GET all products with filtering, search & sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query;
    
    let queryRef = db.collection('products');
    
    // Filter by category directly in Firestore
    if (category && category !== 'All') {
      queryRef = queryRef.where('category', '==', category);
    }
    
    const snapshot = await queryRef.get();
    let products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    // In-memory advanced filter rules to bypass complex Firestore index requirements
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchLower)) || 
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (minRating) {
      products = products.filter(p => p.rating >= parseFloat(minRating));
    }
    
    // Sort logic
    if (sortBy) {
      if (sortBy === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'newest') {
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    } else {
      // Default: sort by newest
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product details and related products
router.get('/:id', async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.id).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const productData = { id: productDoc.id, ...productDoc.data() };
    
    // Fetch related products in the same category
    let relatedProducts = [];
    if (productData.category) {
      const relatedSnapshot = await db.collection('products')
        .where('category', '==', productData.category)
        .limit(5)
        .get();
        
      relatedSnapshot.forEach(doc => {
        if (doc.id !== productData.id) {
          relatedProducts.push({ id: doc.id, ...doc.data() });
        }
      });
    }
    
    res.json({
      product: productData,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// POST create product (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, category, price, discountPrice, stock, rating, images } = req.body;
    
    if (!title || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newProduct = {
      title,
      description: description || '',
      category,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock),
      rating: parseFloat(rating) || 5.0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://via.placeholder.com/400'],
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('products').add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, category, price, discountPrice, stock, rating, images } = req.body;
    
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (rating !== undefined) updateData.rating = parseFloat(rating);
    if (images !== undefined) updateData.images = images;
    
    await productRef.update(updateData);
    
    const updatedDoc = await productRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await productRef.delete();
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
