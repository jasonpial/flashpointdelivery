import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Filter, ChevronRight, Store, Info, Phone, Mail, MapPin, X, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function MarketplaceView() {
  const [products, setProducts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedCart = window.localStorage.getItem('flashpoint_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const persistCart = (nextCart: any[]) => {
    setCart(nextCart);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('flashpoint_cart', JSON.stringify(nextCart));
    }
  };

  const handleAddToCart = (product: any) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      persistCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      persistCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    persistCart(cart.filter(item => item.id !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  useEffect(() => {
    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
    });

    const qBusinesses = query(collection(db, 'businesses'));
    const unsubscribeBusinesses = onSnapshot(qBusinesses, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(docs);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeBusinesses();
    };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBusiness = (id: string) => businesses.find(b => b.id === id);

  return (
    <div className="space-y-8 pb-20">
      {/* Search & Filter Header */}
      <div className="bg-brand-black-light p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Elite Marketplace</h1>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Procurement // Local Business Network</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/checkout" className="flex items-center gap-2 px-5 py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand-yellow-light transition-all text-xs">
                <ShoppingBag size={16} /> Checkout ({cartCount})
              </Link>
              <div className="text-right text-xs font-black uppercase tracking-widest text-slate-400">
                <p>Cart total</p>
                <p className="text-white mt-1">UGX {cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat ? 'bg-brand-yellow text-brand-black shadow-lg shadow-brand-yellow/20' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Businesses Row */}
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-6 min-w-max">
          {businesses.map((business, i) => (
            <motion.div 
              key={business.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-black-light p-6 rounded-2xl border border-white/5 shadow-xl flex items-center gap-4 hover:border-brand-yellow/30 transition-all cursor-default group"
            >
              <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-black transition-all">
                <Store size={24} />
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-tight line-clamp-1">{business.name}</h4>
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">{business.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedProduct(product)}
            className="bg-brand-black-light rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group hover:border-brand-yellow/30 transition-all cursor-pointer"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src={product.imageUrl || product.images?.[0] || ''} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="w-full py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2">
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>
              <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <span className="px-4 py-2 bg-brand-yellow text-brand-black font-black text-[10px] rounded-xl shadow-xl uppercase tracking-widest">
                  View Detail
                </span>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-brand-yellow text-[8px] font-black uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-white font-black uppercase tracking-tight text-xs line-clamp-1">{product.name}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-white font-black text-sm tracking-tight italic">UGX {product.price?.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  {getBusiness(product.businessId)?.name || 'Elite Merchant'}
                </span>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-40 text-center">
            <Package size={48} className="text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No items matching your criteria found in the elite network.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-black-light rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="grid md:grid-cols-2">
                <div className="h-full min-h-[400px]">
                  <img 
                    src={selectedProduct.imageUrl || selectedProduct.images?.[0] || ''} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="px-4 py-1.5 bg-brand-yellow/10 text-brand-yellow rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-yellow/20">
                        {selectedProduct.category}
                      </span>
                      <h2 className="text-3xl font-black text-white mt-4 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                      <X size={32} />
                    </button>
                  </div>

                  <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8 flex-grow">
                    {selectedProduct.description || "Specifications classified for premium members. Contact the verified merchant below for a detailed procurement brief."}
                  </p>

                  <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-3xl font-black text-white tracking-widest underline decoration-brand-yellow underline-offset-8 decoration-4">UGX {selectedProduct.price?.toLocaleString()}</span>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Merchant Integrity</p>
                        <p className="text-brand-yellow font-black uppercase tracking-tight">{getBusiness(selectedProduct.businessId)?.name || 'Verified Partner'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => handleAddToCart(selectedProduct)} className="flex-1 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3">
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => window.open(`tel:${getBusiness(selectedProduct.businessId)?.contactPhone}`, '_blank')}
                        className="flex-1 py-5 bg-white/5 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3"
                      >
                        <Phone size={18} />
                        Contact Base
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
