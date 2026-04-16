import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle, Shield, UserPlus, User, Zap, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createLog } from '../lib/logs';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  useEffect(() => {
    if (roleParam) {
      // If a role is specified, we can pre-fill or show quick login
      if (roleParam === 'ceo' || roleParam === 'admin') {
        setEmail('mimjum88@gmail.com');
      } else if (roleParam === 'handler') {
        setEmail('handler@flashpoint.ug');
      } else if (roleParam === 'client') {
        setEmail('client@flashpoint.ug');
      }
      setPassword('password123'); // Default demo password
    }
  }, [roleParam]);

  const handleDemoLogin = async (role: string) => {
    setLoading(true);
    setError('');
    const demoEmail = role === 'ceo' || role === 'admin' ? 'mimjum88@gmail.com' : `${role}@flashpoint.ug`;
    const demoPass = 'password123';
    const targetRole = role === 'ceo' ? 'admin' : role;

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (err: any) {
        // If user doesn't exist, create them for demo purposes
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(userCredential.user, { displayName: `Demo ${role.toUpperCase()}` });
        } else {
          throw err;
        }
      }

      // Always ensure the role is correct in Firestore for demo accounts
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || `Demo ${role.toUpperCase()}`,
        email: demoEmail,
        role: targetRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      await createLog(userCredential.user.uid, `Demo Login as ${role.toUpperCase()}`);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in the Firebase Console. Please go to Authentication > Sign-in method and enable "Email/Password".');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Demo login failed: Invalid credentials. Please ensure the demo account exists.');
      } else {
        setError(`Demo login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      // Add custom parameters to force account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      
      // Determine role: if roleParam exists, use it. Otherwise default to client.
      // Special case: if email is the admin email, ensure they get admin role.
      let role = 'client';
      if (roleParam) {
        role = roleParam === 'ceo' ? 'admin' : roleParam;
      } else if (result.user.email === 'mimjum88@gmail.com') {
        role = 'admin';
      }

      // Create or update profile
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists() || (roleParam && userDoc.data()?.role !== role)) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email,
          role: role,
          createdAt: userDoc.exists() ? userDoc.data()?.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      
      await createLog(result.user.uid, 'Google Authentication Successful');
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Login Error:", err);
      
      if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window was closed. Please try again.');
      } else if (err.code === 'auth/internal-error') {
        setError('A configuration error occurred. Please ensure Firebase is correctly set up.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`This domain is not authorized in your Firebase project. Please add "${window.location.hostname}" to the Authorized Domains in the Firebase Console (Authentication > Settings).`);
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in your Firebase project. Please enable it in the Firebase Console (Authentication > Sign-in method).');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Firebase configuration not found or invalid. Please check your settings.');
      } else {
        setError(`Google Sign-In failed: ${err.message} (${err.code}). Please ensure your Firebase project is correctly configured.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        
        // If they came from a specific portal link, update their role
        if (roleParam) {
          const user = auth.currentUser;
          if (user) {
            const role = roleParam === 'ceo' ? 'admin' : roleParam;
            await setDoc(doc(db, 'users', user.uid), {
              role: role,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        }
        await createLog(result.user.uid, 'Email Login Successful');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: fullName });
        
        // Determine role
        let role = 'client';
        if (roleParam) {
          role = roleParam === 'ceo' ? 'admin' : roleParam;
        } else if (email === 'mimjum88@gmail.com') {
          role = 'admin';
        }

        // Create Firestore profile
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: fullName,
          email: email,
          role: role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await createLog(result.user.uid, 'Account Registration Successful');
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in the Firebase Console. Please go to Authentication > Sign-in method and enable "Email/Password".');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2071&auto=format&fit=crop" 
          alt="Secure login" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-brand-black-light rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity duration-700">
          <img 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop" 
            alt="Security background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10">
          <div className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-yellow rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
            <Shield size={32} className="text-brand-black sm:hidden" />
            <Shield size={40} className="text-brand-black hidden sm:block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tighter uppercase">
            {isLogin ? 'SECURE ACCESS' : 'JOIN THE ELITE'}
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-base">
            {isLogin ? 'Sign in to your Flashpoint portal' : 'Create your secure delivery account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-red-500/10 text-red-500 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold border border-red-500/20">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {roleParam && (
            <button 
              onClick={() => handleDemoLogin(roleParam)}
              disabled={loading}
              className="w-full py-4 sm:py-5 px-6 bg-brand-yellow text-brand-black rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 sm:gap-4 font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/20 disabled:opacity-50"
            >
              <Zap size={18} className="fill-brand-black" />
              Quick Login as {roleParam.toUpperCase()}
            </button>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 sm:py-5 px-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 sm:gap-4 font-black uppercase tracking-widest text-[10px] sm:text-xs text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5" />
            Continue with Google
          </button>

          <div className="relative py-4 sm:py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[8px] sm:text-[10px] uppercase font-black tracking-[0.3em]">
              <span className="bg-brand-black-light px-4 sm:px-6 text-slate-500">Secure Credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all font-medium text-white text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@company.ug"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all font-medium text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all font-medium text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-yellow transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 sm:py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-xl sm:rounded-2xl hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-slate-500 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-yellow font-black cursor-pointer hover:underline transition-all"
          >
            {isLogin ? 'Join the Elite' : 'Sign In Now'}
          </button>
        </p>
      </div>
    </motion.div>
    </div>
  );
}
