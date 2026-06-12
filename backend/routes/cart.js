const router = require('express').Router();
const { db } = require('../firebase/admin');
const { verifyToken } = require('../utils/auth');

// GET user cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartRef = db.collection('cart').doc(userId);
    const cartDoc = await cartRef.get();
    
    if (!cartDoc.exists) {
      const defaultCart = { userId, items: [], updatedAt: new Date().toISOString() };
      await cartRef.set(defaultCart);
      return res.json(defaultCart);
    }
    
    res.json(cartDoc.data());
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// POST save/sync user cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.uid;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }
    
    const cartRef = db.collection('cart').doc(userId);
    const cartData = {
      userId,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: parseFloat(item.price),
        discountPrice: item.discountPrice !== undefined && item.discountPrice !== null ? parseFloat(item.discountPrice) : null,
        quantity: parseInt(item.quantity),
        image: item.image || item.images?.[0] || '',
        stock: item.stock !== undefined ? parseInt(item.stock) : 99
      })),
      updatedAt: new Date().toISOString()
    };
    
    await cartRef.set(cartData);
    res.json(cartData);
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

module.exports = router;
