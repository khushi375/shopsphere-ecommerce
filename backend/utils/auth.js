const { db, auth } = require('../firebase/admin');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split('Bearer ')[1];
    
    // In case token verification is skipped or mocked in local testing
    if (process.env.NODE_ENV === 'development' && token === 'mock-admin-token') {
      req.user = {
        uid: 'mock-admin-uid',
        email: 'admin@shopsphere.com',
        role: 'admin',
        name: 'Mock Admin',
        photoURL: ''
      };
      return next();
    }
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-user-token-')) {
      const suffix = token.replace('mock-user-token-', '');
      req.user = {
        uid: `mock-uid-${suffix}`,
        email: `${suffix}@gmail.com`,
        role: 'user',
        name: `Mock User ${suffix}`,
        photoURL: ''
      };
      return next();
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token', message: err.message });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email || '';
    
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    let role = 'user';
    let name = decodedToken.name || email.split('@')[0];
    let photoURL = decodedToken.picture || '';

    if (userDoc.exists) {
      const userData = userDoc.data();
      role = userData.role || 'user';
      name = userData.name || name;
      photoURL = userData.photoURL || photoURL;
    } else {
      // First-time login: create the user document
      // Auto-assign admin if email matches admin@shopsphere.com
      role = email.toLowerCase() === 'admin@shopsphere.com' ? 'admin' : 'user';
      
      const newUserData = {
        name,
        email,
        role,
        photoURL,
        createdAt: new Date().toISOString()
      };
      await userRef.set(newUserData);
    }
    
    req.user = {
      uid,
      email,
      role,
      name,
      photoURL
    };
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Internal server error in auth verification' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};

module.exports = { verifyToken, verifyAdmin };
