const router = require('express').Router();
const { db } = require('../firebase/admin');
const { verifyToken } = require('../utils/auth');

// GET user wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const wishlistRef = db.collection('wishlist').doc(userId);
    const wishlistDoc = await wishlistRef.get();
    
    if (!wishlistDoc.exists) {
      const defaultWishlist = { userId, items: [], updatedAt: new Date().toISOString() };
      await wishlistRef.set(defaultWishlist);
      return res.json(defaultWishlist);
    }
    
    res.json(wishlistDoc.data());
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
});

// POST save/sync user wishlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.uid;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }
    
    const wishlistRef = db.collection('wishlist').doc(userId);
    const wishlistData = {
      userId,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: parseFloat(item.price),
        discountPrice: item.discountPrice !== undefined && item.discountPrice !== null ? parseFloat(item.discountPrice) : null,
        image: item.image || item.images?.[0] || '',
        stock: item.stock !== undefined ? parseInt(item.stock) : 99
      })),
      updatedAt: new Date().toISOString()
    };
    
    await wishlistRef.set(wishlistData);
    res.json(wishlistData);
  } catch (error) {
    console.error('Error saving wishlist:', error);
    res.status(500).json({ error: 'Failed to save wishlist' });
  }
});

module.exports = router;
