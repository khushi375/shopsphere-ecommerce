import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync profile details and roles from Express backend
  const fetchUserProfile = async (firebaseUser) => {
    try {
      const response = await api.get('/api/users/profile');
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: response.data.name || firebaseUser.displayName || 'ShopSphere User',
        role: response.data.role || 'user',
        photoURL: response.data.photoURL || firebaseUser.photoURL || ''
      });
    } catch (error) {
      console.error("Error fetching user profile from backend:", error);
      // Fallback if backend profile fetch fails, but user is logged into Firebase
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        role: firebaseUser.email.toLowerCase() === 'admin@shopsphere.com' ? 'admin' : 'user',
        photoURL: firebaseUser.photoURL || ''
      });
    }
  };

  useEffect(() => {
    // If Firebase isn't configured, check local storage for development mock session
    if (!auth || !auth.config) {
      const mockToken = localStorage.getItem('mock_token');
      if (mockToken) {
        const email = mockToken === 'mock-admin-token' ? 'admin@shopsphere.com' : 'user@shopsphere.com';
        setUser({
          uid: mockToken === 'mock-admin-token' ? 'mock-admin-uid' : 'mock-user-uid',
          email,
          name: mockToken === 'mock-admin-token' ? 'Mock Admin' : 'Mock User',
          role: mockToken === 'mock-admin-token' ? 'admin' : 'user',
          photoURL: ''
        });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        localStorage.removeItem('mock_token'); // Clean dev token if real exists
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Check if Firebase client configuration is missing to fallback into dev mock mode
      if (!auth || !auth.config) {
        const isEmailAdmin = email.toLowerCase() === 'admin@shopsphere.com';
        const role = isEmailAdmin ? 'admin' : 'user';
        const mockUser = {
          uid: isEmailAdmin ? 'mock-admin-uid' : 'mock-user-uid',
          email,
          name: isEmailAdmin ? 'Mock Admin' : 'Mock User',
          role,
          photoURL: ''
        };
        localStorage.setItem('mock_token', isEmailAdmin ? 'mock-admin-token' : 'mock-user-token-user');
        setUser(mockUser);
        toast.success(`Welcome back, ${mockUser.name}! (Demo Mode)`);
        setLoading(false);
        return mockUser;
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      return credential.user;
    } catch (error) {
      toast.error(error.message || "Failed to sign in. Please verify credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      if (!auth || !auth.config) {
        const isEmailAdmin = email.toLowerCase() === 'admin@shopsphere.com';
        const role = isEmailAdmin ? 'admin' : 'user';
        const mockUser = {
          uid: isEmailAdmin ? 'mock-admin-uid' : 'mock-user-uid',
          email,
          name,
          role,
          photoURL: ''
        };
        localStorage.setItem('mock_token', isEmailAdmin ? 'mock-admin-token' : 'mock-user-token-user');
        setUser(mockUser);
        toast.success(`Account created, welcome ${name}! (Demo Mode)`);
        setLoading(false);
        return mockUser;
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      
      // Hit profile endpoint to create document in Firestore
      try {
        await api.post('/api/users/profile', {}, {
          headers: {
            Authorization: `Bearer ${await credential.user.getIdToken()}`
          }
        });
      } catch (err) {
        console.warn("Backend registration hook failed, profile will generate on next verify.", err);
      }

      toast.success("Registered successfully!");
      return credential.user;
    } catch (error) {
      toast.error(error.message || "Failed to register new account.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (!auth || !auth.config || !googleProvider) {
        // Fallback for Google sign-in if unconfigured
        const mockUser = {
          uid: 'mock-google-uid',
          email: 'googleuser@shopsphere.com',
          name: 'Google User',
          role: 'user',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
        };
        localStorage.setItem('mock_token', 'mock-user-token-google');
        setUser(mockUser);
        toast.success(`Signed in as ${mockUser.name}! (Demo Mode)`);
        setLoading(false);
        return mockUser;
      }

      const credential = await signInWithPopup(auth, googleProvider);
      toast.success("Google sign-in successful!");
      return credential.user;
    } catch (error) {
      toast.error(error.message || "Google authentication failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!auth || !auth.config) {
        localStorage.removeItem('mock_token');
        setUser(null);
        toast.info("Logged out (Demo Mode)");
        setLoading(false);
        return;
      }
      await signOut(auth);
      toast.info("Logged out successfully.");
    } catch (error) {
      toast.error("Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
