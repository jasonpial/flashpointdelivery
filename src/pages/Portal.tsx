import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, ShieldCheck, Zap, ArrowRight, Shield, Package, Users, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import backgroundImage from '../assets/images/img12.jpg';
export default function Portal() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={backgroundImage} 
          alt="Logistics network" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase"
          >
            SECURE <span className="text-brand-yellow">SIGN IN</span>
          </motion.h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Select your destination to access your specialized Flashpoint dashboard.
          </p>
        </div>

        {/* Quick Access Section */}
        <div className="mb-20 relative">
          <div className="flex flex-col gap-4 items-center">
            <Link 
              to="/login?role=client"
              className="px-4 py-2 bg-black/50 text-white font-normal uppercase tracking-wider rounded-xl hover:bg-gray-900/50 transition-all text-sm border border-brand-yellow"
            >
              Client
            </Link>
            <Link 
              to="/login?role=handler"
              className="px-4 py-2 bg-black/50 text-white font-normal uppercase tracking-wider rounded-xl hover:bg-gray-900/50 transition-all text-sm border border-brand-yellow"
            >
              Handler
            </Link>
            <Link 
              to="/login?role=ceo"
              className="px-4 py-2 bg-black/50 text-white font-normal uppercase tracking-wider rounded-xl hover:bg-gray-900/50 transition-all text-sm border border-brand-yellow"
            >
              CEO / Admin
            </Link>
            <Link 
              to="/login?role=seller"
              className="px-4 py-2 bg-black/50 text-white font-normal uppercase tracking-wider rounded-xl hover:bg-gray-900/50 transition-all text-sm border border-brand-yellow"
            >
              Seller
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-brand-black-light rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img 
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065&auto=format&fit=crop" 
                alt="Client portal" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-yellow rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.2)] group-hover:scale-110 transition-transform">
                <Shield size={28} className="text-brand-black" />
              </div>
              <h2 className="text-2xl font-black mb-3 uppercase tracking-tight">Secure Client Portal</h2>
              <p className="text-slate-400 mb-8 text-base font-medium leading-relaxed">Access your private dashboard to manage high-value shipments and secure documents.</p>
              <Link 
                to="/login" 
                className="inline-flex flex-col items-center justify-center gap-1 px-3 py-1.5 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10"
              >
                Enter Secure
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Globe size={400} />
            </div>
          </div>

          <div className="bg-brand-black-light rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" 
                alt="Tracking" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <Zap size={28} className="text-brand-yellow" />
              </div>
              <h2 className="text-2xl font-black mb-3 uppercase tracking-tight">Public Tracking</h2>
              <p className="text-slate-400 mb-8 text-base font-medium leading-relaxed">Instantly check the status of any shipment using your unique Flashpoint ID.</p>
              <Link 
                to="/track/FP-UG-100200" 
                className="inline-flex flex-col items-center justify-center gap-1 px-3 py-1.5 bg-white/5 text-white font-black uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-all border border-white/10"
              >
                Track
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Zap size={400} />
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Live Seller Products</h2>
              <p className="text-slate-400 text-sm">All products added by sellers are shown here for client review.</p>
            </div>
            <Link to="/checkout" className="px-6 py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand-yellow-light transition-all text-xs">
              Go to Checkout
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? products.map((product, i) => (
              <div key={product.id} className="bg-brand-black-light rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                <div className="h-56 overflow-hidden">
                  <img
                    src={product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=400&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{product.category || 'General'}</p>
                    <span className="text-brand-yellow font-black text-xs uppercase tracking-[0.2em]">UGX {product.price?.toLocaleString() || '0'}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight line-clamp-2">{product.name}</h3>
                  {product.description ? <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{product.description}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Stock: {product.stock ?? 'N/A'}</span>
                    {product.sku ? <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">SKU: {product.sku}</span> : null}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full rounded-[2rem] p-12 text-center bg-brand-black-light border border-white/5">
                <p className="text-slate-400">No seller products are listed yet. Seller listings will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>

      <div className="bg-brand-yellow/5 rounded-[2.5rem] p-12 flex flex-wrap items-center justify-between gap-10 border border-brand-yellow/10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center text-brand-black shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security First</h3>
              <p className="text-slate-400 font-medium">All Flashpoint deliveries are protected by our 24/7 elite security monitoring center.</p>
            </div>
          </div>
          <button className="px-10 py-5 bg-white/5 text-white font-black uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            Security Protocols
          </button>
        </div>
      </div>
    </div>
  );
}
