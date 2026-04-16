import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

// Types
export type UserRole = 'client' | 'handler' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

// Context
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tracking from './pages/Tracking';
import Portal from './pages/Portal';
import Pricing from './pages/Pricing';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';

import { Shield } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile snapshot error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-yellow rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-brand-yellow">
            <Shield size={32} />
          </div>
        </div>
        <h2 className="text-white font-black uppercase tracking-widest text-xs animate-pulse">Initializing Secure Systems...</h2>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen pb-20 lg:pb-0">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/track/:id" element={<Tracking />} />
              <Route 
                path="/dashboard/*" 
                element={user ? <Dashboard /> : <Navigate to="/login" />} 
              />
            </Routes>
          </main>
          <div className="lg:hidden">
            <BottomNav />
          </div>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
