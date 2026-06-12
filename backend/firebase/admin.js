const admin = require('firebase-admin');
require('dotenv').config();

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT JSON string.');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      })
    });
    console.log('Firebase Admin initialized from individual environment variables.');
  } else {
    // Attempt default app initialization
    admin.initializeApp();
    console.log('Firebase Admin initialized using default application credentials.');
  }
} catch (error) {
  console.warn('Firebase Admin SDK warning/error during initialization:', error.message);
  console.warn('Application will fall back to using default config or mock mode if credentials are missing.');
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
