import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Plus, Package, Trash2, Edit3, Save, X, Globe, DollarSign, Tag, Archive, CheckCircle2, AlertCircle, Upload, Image, Search, Filter, SortAsc, Eye, TrendingUp, ShoppingCart, Star, Shield, Truck, Clock, Zap, BarChart3, Users, Award, Camera, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { db } from '../firebase';
import { useAuth } from '../App';

export default function SellerView() {
  const { user, profile } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [dragOver, setDragOver] = useState(false);

  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    category: 'Retail',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    category: 'General',
    stock: 10,
    sku: '',
    weight: '',
    dimensions: '',
    tags: '',
    brand: '',
    condition: 'New',
    color: '',
    variants: '',
    shippingFee: 0,
    deliveryTime: '',
    sellerNotes: '',
    warranty: '',
    images: [] as string[],
    isAvailable: true,
    isFeatured: false,
    approvalStatus: 'pending'
  });

  const updateProductImage = (index: number, value: string) => {
    setProductData((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return { ...prev, images: nextImages };
    });
  };

  const addProductImageField = () => {
    setProductData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeProductImageField = (index: number) => {
    setProductData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setProductData((prev) => {
      const newImages = [...prev.images];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return { ...prev, images: newImages };
    });
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;
    setUploadingImages(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `products/${user?.uid}/${fileName}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newImages.push(downloadURL);
        setUploadProgress(prev => ({ ...prev, [fileName]: 100 }));
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setProductData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploadingImages(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const removeUploadedImage = async (imageUrl: string, index: number) => {
    try {
      // If it's a Firebase Storage URL, delete from storage
      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      setProductData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Check if user has a business
    const qBusiness = query(collection(db, 'businesses'), where('ownerUid', '==', user.uid));
    const unsubscribeBusiness = onSnapshot(qBusiness, (snapshot) => {
      if (!snapshot.empty) {
        const busDoc = snapshot.docs[0];
        setBusiness({ id: busDoc.id, ...busDoc.data() });
      } else {
        setBusiness(null);
      }
    });

    return () => unsubscribeBusiness();
  }, [user]);

  useEffect(() => {
    if (!business) {
      setProducts([]);
      return;
    }

    const qProducts = query(collection(db, 'products'), where('businessId', '==', business.id), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
    });

    return () => unsubscribeProducts();
  }, [business]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const activeListings = products.filter(p => p.isAvailable !== false).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    const featuredProducts = products.filter(p => p.isFeatured).length;

    return {
      totalProducts,
      activeListings,
      outOfStock,
      totalValue,
      averagePrice,
      featuredProducts
    };
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - new Date(a.createdAt?.toDate?.() || a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt?.toDate?.() || a.createdAt).getTime() - new Date(b.createdAt?.toDate?.() || b.createdAt).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  const handleRegisterBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, 'businesses'), {
        ownerUid: user.uid,
        ...businessData,
        createdAt: serverTimestamp()
      });
      
      // Update user profile with businessId
      await updateDoc(doc(db, 'users', user.uid), {
        businessId: docRef.id
      });

      // Immediately show the new storefront while Firestore syncs
      setBusiness({
        id: docRef.id,
        ownerUid: user.uid,
        ...businessData,
        createdAt: new Date()
      });
      setShowBusinessForm(false);
    } catch (err) {
      console.error("Error registering business:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !user) return;

    // Validation
    if (productData.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (productData.stock < 0) {
      alert('Stock cannot be negative');
      return;
    }
    if (!productData.name.trim()) {
      alert('Product name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const productPayload = {
        ...productData,
        sellerUid: user.uid,
        sellerName: profile?.name || user.email,
        businessId: business.id,
        businessName: business.name,
        createdAt: editingProduct ? editingProduct.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productPayload);
      } else {
        await addDoc(collection(db, 'products'), productPayload);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductData({
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        category: 'General',
        stock: 10,
        sku: '',
        weight: '',
        dimensions: '',
        tags: '',
        brand: '',
        condition: 'New',
        color: '',
        variants: '',
        shippingFee: 0,
        deliveryTime: '',
        sellerNotes: '',
        warranty: '',
        images: [],
        isAvailable: true,
        isFeatured: false,
        approvalStatus: 'pending'
      });
    } catch (err) {
      console.error("Error handling product:", err);
      alert('Error saving product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (!business && !showBusinessForm) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-brand-black-light rounded-[2.5rem] border border-white/5 shadow-2xl text-center">
        <div className="w-24 h-24 bg-brand-yellow/10 rounded-[2rem] flex items-center justify-center text-brand-yellow mb-8 border border-brand-yellow/20">
          <Store size={48} />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Your Storefront Awaits</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg font-medium">Ready to showcase your products to the Flashpoint elite network? Register your business now.</p>
        <button 
          onClick={() => setShowBusinessForm(true)}
          className="w-full sm:w-auto px-10 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl shadow-brand-yellow/20"
        >
          Initialize Business Registration
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* business Header Card */}
      <div className="bg-brand-black-light p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Business background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center text-brand-black shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <Store size={40} />
            </div>
            <div>
              <p className="text-xs text-brand-yellow uppercase tracking-[0.3em] mb-3">My Store</p>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{business?.name || "My Store"}</h1>
              <p className="text-slate-400 text-sm max-w-2xl mt-2">Manage your product catalog, upload images, set prices, stock, SKU and descriptions for each listing.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductData({
                  name: '',
                  description: '',
                  price: 0,
                  discountPrice: 0,
                  category: 'General',
                  stock: 10,
                  sku: '',
                  weight: '',
                  dimensions: '',
                  tags: '',
                  brand: '',
                  condition: 'New',
                  color: '',
                  variants: '',
                  shippingFee: 0,
                  deliveryTime: '',
                  sellerNotes: '',
                  warranty: '',
                  images: [],
                  isAvailable: true,
                  isFeatured: false,
                  approvalStatus: 'pending'
                });
                setShowProductForm(true);
              }}
              className="px-6 py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Analytics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-black-light p-6 rounded-[2rem] border border-white/5 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-brand-yellow" size={20} />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Analytics</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Total Products</span>
                <span className="text-white font-black text-lg">{analytics.totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Active Listings</span>
                <span className="text-green-400 font-black text-lg">{analytics.activeListings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Out of Stock</span>
                <span className="text-red-400 font-black text-lg">{analytics.outOfStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Featured</span>
                <span className="text-yellow-400 font-black text-lg">{analytics.featuredProducts}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-black-light p-6 rounded-[2rem] border border-white/5 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-brand-yellow" size={20} />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Revenue</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Total Value</span>
                <span className="text-white font-black">UGX {analytics.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Avg Price</span>
                <span className="text-white font-black">UGX {Math.round(analytics.averagePrice).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-yellow p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group"
          >
            <Globe className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" size={150} />
            <h3 className="text-brand-black font-black text-xl uppercase tracking-tighter mb-4 relative z-10">Flashpoint Market</h3>
            <p className="text-brand-black/70 text-xs font-medium mb-6 relative z-10">Your products are now visible to every logistics client in our global network.</p>
            <div className="flex items-center gap-2 text-brand-black/80 text-xs font-medium relative z-10">
              <Shield size={14} />
              <span>Verified Seller</span>
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Search and Filter Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-black-light p-6 rounded-[2rem] border border-white/5 shadow-2xl mb-6"
          >
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-medium min-w-0"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-brand-black">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name">Name A-Z</option>
                </select>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setProductData({
                      name: '',
                      description: '',
                      price: 0,
                      discountPrice: 0,
                      category: 'General',
                      stock: 10,
                      sku: '',
                      weight: '',
                      dimensions: '',
                      tags: '',
                      brand: '',
                      condition: 'New',
                      color: '',
                      variants: '',
                      shippingFee: 0,
                      deliveryTime: '',
                      sellerNotes: '',
                      warranty: '',
                      images: [],
                      isAvailable: true,
                      isFeatured: false,
                      approvalStatus: 'pending'
                    });
                    setShowProductForm(true);
                  }}
                  className="px-6 py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10"
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-brand-black-light rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group hover:border-brand-yellow/30 transition-all relative"
              >
                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-brand-yellow text-brand-black rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  </div>
                )}

                {/* Availability Status */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${
                    product.isAvailable !== false 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {product.isAvailable !== false ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    {product.isAvailable !== false ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="aspect-square relative">
                  <img 
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=400&auto=format&fit=crop'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-2 bg-brand-black/80 backdrop-blur-md text-brand-yellow font-black text-sm rounded-xl border border-white/10">
                        UGX {product.price?.toLocaleString()}
                        {product.discountPrice > 0 && product.discountPrice < product.price && (
                          <span className="ml-2 text-red-400 line-through text-xs">
                            UGX {product.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1 px-3 py-2 bg-brand-black/80 backdrop-blur-md rounded-xl border border-white/10">
                        <Archive size={12} className="text-slate-300" />
                        <span className="text-white font-black text-xs">{product.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-yellow text-[8px] font-black uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-white font-black uppercase tracking-tight text-sm line-clamp-2 leading-tight">{product.name}</h3>
                      </div>
                      {product.brand && (
                        <span className="px-2 py-1 bg-white/5 text-slate-300 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    {product.description && <p className="text-slate-400 text-sm line-clamp-2">{product.description}</p>}
                    
                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {product.sku && <div className="text-slate-500">SKU: <span className="text-white font-medium">{product.sku}</span></div>}
                      {product.condition && <div className="text-slate-500">Condition: <span className="text-white font-medium">{product.condition}</span></div>}
                      {product.color && <div className="text-slate-500">Color: <span className="text-white font-medium">{product.color}</span></div>}
                      {product.weight && <div className="text-slate-500">Weight: <span className="text-white font-medium">{product.weight}</span></div>}
                      {product.deliveryTime && (
                        <div className="text-slate-500 flex items-center gap-1">
                          <Clock size={10} />
                          <span className="text-white font-medium">{product.deliveryTime}</span>
                        </div>
                      )}
                      {product.shippingFee > 0 && (
                        <div className="text-slate-500 flex items-center gap-1">
                          <Truck size={10} />
                          <span className="text-white font-medium">UGX {product.shippingFee}</span>
                        </div>
                      )}
                    </div>

                    {product.tags && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.split(',').slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-brand-yellow/10 text-brand-yellow rounded text-[8px] font-medium">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                      <Eye size={12} />
                      <span>Views: {product.views || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setProductData({
                            name: product.name || '',
                            description: product.description || '',
                            price: product.price || 0,
                            discountPrice: product.discountPrice || 0,
                            category: product.category || 'General',
                            stock: product.stock || 0,
                            sku: product.sku || '',
                            weight: product.weight || '',
                            dimensions: product.dimensions || '',
                            tags: product.tags || '',
                            brand: product.brand || '',
                            condition: product.condition || 'New',
                            color: product.color || '',
                            variants: product.variants || '',
                            shippingFee: product.shippingFee || 0,
                            deliveryTime: product.deliveryTime || '',
                            sellerNotes: product.sellerNotes || '',
                            warranty: product.warranty || '',
                            images: product.images || [],
                            isAvailable: product.isAvailable !== false,
                            isFeatured: product.isFeatured || false,
                            approvalStatus: product.approvalStatus || 'pending'
                          });
                          setShowProductForm(true);
                        }}
                        className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-brand-yellow transition-all"
                        title="Edit Product"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <Package size={48} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No products listed. Start selling today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms Modals */}
      <AnimatePresence>
        {showBusinessForm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBusinessForm(false)}
              className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-brand-black-light rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 bg-brand-yellow text-brand-black flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Store size={28} />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Business Registration</h2>
                </div>
                <button onClick={() => setShowBusinessForm(false)} className="hover:rotate-90 transition-transform">
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleRegisterBusiness} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Business Name</label>
                    <input required type="text" value={businessData.name} onChange={e => setBusinessData({...businessData, name: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <select value={businessData.category} onChange={e => setBusinessData({...businessData, category: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-black uppercase tracking-widest text-xs appearance-none">
                      <option value="Retail" className="bg-brand-black">Retail</option>
                      <option value="Electronics" className="bg-brand-black">Electronics</option>
                      <option value="Luxury" className="bg-brand-black">Luxury Goods</option>
                      <option value="Machinery" className="bg-brand-black">Machinery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Public Phone</label>
                    <input required type="tel" value={businessData.contactPhone} onChange={e => setBusinessData({...businessData, contactPhone: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mission Description</label>
                  <textarea rows={3} value={businessData.description} onChange={e => setBusinessData({...businessData, description: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="Describe what you sell..."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? "TRANSMITTING..." : "REGISTER BUSINESS"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showProductForm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-black-light rounded-[2.5rem] shadow-2xl border border-white/10"
            >
              <div className="p-8 bg-brand-yellow text-brand-black flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <Package size={28} />
                  <h2 className="text-2xl font-black uppercase tracking-tight">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                </div>
                <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="hover:rotate-90 transition-transform">
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleProductSubmit} className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Product Name *</label>
                      <input required type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category *</label>
                      <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-black uppercase tracking-widest text-xs appearance-none">
                        <option value="General" className="bg-brand-black">General</option>
                        <option value="Electronics" className="bg-brand-black">Electronics</option>
                        <option value="Fashion" className="bg-brand-black">Fashion</option>
                        <option value="Home & Garden" className="bg-brand-black">Home & Garden</option>
                        <option value="Sports" className="bg-brand-black">Sports</option>
                        <option value="Books" className="bg-brand-black">Books</option>
                        <option value="Automotive" className="bg-brand-black">Automotive</option>
                        <option value="Health & Beauty" className="bg-brand-black">Health & Beauty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Brand</label>
                      <input type="text" value={productData.brand} onChange={e => setProductData({...productData, brand: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Condition</label>
                      <select value={productData.condition} onChange={e => setProductData({...productData, condition: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-medium">
                        <option value="New" className="bg-brand-black">New</option>
                        <option value="Used - Like New" className="bg-brand-black">Used - Like New</option>
                        <option value="Used - Good" className="bg-brand-black">Used - Good</option>
                        <option value="Used - Fair" className="bg-brand-black">Used - Fair</option>
                        <option value="Refurbished" className="bg-brand-black">Refurbished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Color</label>
                      <input type="text" value={productData.color} onChange={e => setProductData({...productData, color: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. Black, Red, Blue" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea rows={4} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="Detailed product description..."></textarea>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price (UGX) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-yellow" size={16} />
                        <input required type="number" min="0" step="0.01" value={productData.price} onChange={e => setProductData({...productData, price: Number(e.target.value)})} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Discount Price (UGX)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={16} />
                        <input type="number" min="0" step="0.01" value={productData.discountPrice} onChange={e => setProductData({...productData, discountPrice: Number(e.target.value)})} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="Optional" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stock Quantity *</label>
                      <input required type="number" min="0" value={productData.stock} onChange={e => setProductData({...productData, stock: Number(e.target.value)})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                    </div>
                  </div>
                </div>

                {/* Shipping & Logistics */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Shipping & Logistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Weight</label>
                      <input type="text" value={productData.weight} onChange={e => setProductData({...productData, weight: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. 1.5kg, 500g" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dimensions</label>
                      <input type="text" value={productData.dimensions} onChange={e => setProductData({...productData, dimensions: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. 30x20x10cm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Shipping Fee (UGX)</label>
                      <div className="relative">
                        <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-yellow" size={16} />
                        <input type="number" min="0" step="0.01" value={productData.shippingFee} onChange={e => setProductData({...productData, shippingFee: Number(e.target.value)})} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Delivery Time</label>
                      <input type="text" value={productData.deliveryTime} onChange={e => setProductData({...productData, deliveryTime: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. 2-3 business days" />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Additional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SKU / Product Code</label>
                      <input type="text" value={productData.sku} onChange={e => setProductData({...productData, sku: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tags / Keywords</label>
                      <input type="text" value={productData.tags} onChange={e => setProductData({...productData, tags: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. luxury, electronics, premium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Variants</label>
                      <input type="text" value={productData.variants} onChange={e => setProductData({...productData, variants: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. Size: S,M,L,XL | Color: Red,Blue,Black" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Warranty</label>
                      <input type="text" value={productData.warranty} onChange={e => setProductData({...productData, warranty: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="e.g. 1 year manufacturer warranty" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Seller Notes</label>
                      <input type="text" value={productData.sellerNotes} onChange={e => setProductData({...productData, sellerNotes: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium" placeholder="Internal notes..." />
                    </div>
                  </div>
                </div>

                {/* Product Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Product Settings</h3>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={productData.isAvailable} onChange={e => setProductData({...productData, isAvailable: e.target.checked})} className="w-5 h-5 accent-brand-yellow" />
                      <span className="text-white font-medium">Available for Purchase</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={productData.isFeatured} onChange={e => setProductData({...productData, isFeatured: e.target.checked})} className="w-5 h-5 accent-brand-yellow" />
                      <span className="text-white font-medium">Featured Product</span>
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Product Images</h3>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragOver ? 'border-brand-yellow bg-brand-yellow/5' : 'border-white/20 hover:border-brand-yellow/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-white font-medium mb-2">Drag & drop images here or click to browse</p>
                    <p className="text-slate-400 text-sm mb-6">Supported formats: JPG, PNG, WebP (Max 5MB each)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="inline-block px-6 py-3 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-brand-yellow-light transition-all">
                      Choose Files
                    </label>
                  </div>

                  {uploadingImages && (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-brand-yellow font-medium">Uploading images...</p>
                    </div>
                  )}

                  {productData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {productData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Product ${index + 1}`} 
                            className="w-full aspect-square object-cover rounded-xl border border-white/10" 
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(image, index)}
                            className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={12} />
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => reorderImages(index, index - 1)}
                              className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronUp size={12} />
                            </button>
                          )}
                          {index < productData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => reorderImages(index, index + 1)}
                              className="absolute bottom-2 left-2 p-1 bg-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronDown size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-yellow-light transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                      {editingProduct ? "UPDATING PRODUCT..." : "PUBLISHING TO MARKET..."}
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      {editingProduct ? "UPDATE PRODUCT" : "PUBLISH TO MARKET"}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
