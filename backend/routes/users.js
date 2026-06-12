const router = require('express').Router();
const { db } = require('../firebase/admin');
const { verifyToken, verifyAdmin } = require('../utils/auth');

// GET all users (Admin only, searchable)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    const snapshot = await db.collection('users').get();
    let users = [];
    snapshot.forEach(doc => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(searchLower)) ||
        (u.email && u.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort users by name or email
    users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET user profile (Customer)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      // User is authenticated but profile document doesn't exist yet, we create it dynamically.
      const name = req.user.name || req.user.email.split('@')[0];
      const newProfile = {
        name,
        email: req.user.email,
        role: req.user.role || 'user',
        photoURL: req.user.photoURL || '',
        createdAt: new Date().toISOString()
      };
      await db.collection('users').doc(userId).set(newProfile);
      return res.json({ uid: userId, ...newProfile });
    }
    res.json({ uid: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile details' });
  }
});

// POST create or update user profile
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, photoURL } = req.body;
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    let profileData = {};
    if (userDoc.exists) {
      profileData = userDoc.data();
      if (name) profileData.name = name;
      if (photoURL) profileData.photoURL = photoURL;
      await userRef.update(profileData);
    } else {
      profileData = {
        name: name || req.user.name || req.user.email.split('@')[0],
        email: req.user.email,
        role: req.user.email.toLowerCase() === 'admin@shopsphere.com' ? 'admin' : 'user',
        photoURL: photoURL || req.user.photoURL || '',
        createdAt: new Date().toISOString()
      };
      await userRef.set(profileData);
    }
    res.json({ uid: userId, ...profileData });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile details' });
  }
});

module.exports = router;
