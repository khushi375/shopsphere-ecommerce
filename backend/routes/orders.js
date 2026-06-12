const router = require('express').Router();
const { db } = require('../firebase/admin');
const { verifyToken, verifyAdmin } = require('../utils/auth');

// POST place a new order (Customer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user.uid;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ error: 'Shipping details are incomplete' });
    }

    const orderRef = db.collection('orders').doc();
    const cartRef = db.collection('cart').doc(userId);
    
    // Perform database transaction for atomic stock checks and modifications
    await db.runTransaction(async (transaction) => {
      const productDocs = [];
      
      // Fetch all products to verify stock
      for (const item of items) {
        const prodRef = db.collection('products').doc(item.id);
        const prodDoc = await transaction.get(prodRef);
        if (!prodDoc.exists) {
          throw new Error(`Product ${item.title || item.id} does not exist`);
        }
        productDocs.push({ ref: prodRef, doc: prodDoc, item });
      }
      
      // Verify stock level matches request
      for (const p of productDocs) {
        const stock = p.doc.data().stock || 0;
        if (stock < p.item.quantity) {
          throw new Error(`Insufficient stock for "${p.item.title}". Available: ${stock}`);
        }
      }
      
      // Deduct stock levels
      for (const p of productDocs) {
        const currentStock = p.doc.data().stock || 0;
        transaction.update(p.ref, { stock: currentStock - p.item.quantity });
      }
      
      // Create the order document
      const orderData = {
        userId,
        products: items,
        totalAmount: parseFloat(totalAmount),
        status: 'Pending',
        shippingAddress,
        createdAt: new Date().toISOString()
      };
      
      transaction.set(orderRef, orderData);
      
      // Clear user cart
      transaction.set(cartRef, { userId, items: [] });
    });
    
    res.status(201).json({ message: 'Order placed successfully', orderId: orderRef.id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(400).json({ error: error.message || 'Failed to place order' });
  }
});

// GET user order history (Customer)
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .get();
      
    let orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in-memory to prevent requiring composite indices on userId + createdAt
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// GET all orders (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('orders').get();
    let orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// PUT update order status (Admin only)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await orderRef.update({ status });
    res.json({ id: req.params.id, status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
