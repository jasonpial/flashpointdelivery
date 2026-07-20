import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Shield, Clock, ArrowRight, MapPin, Phone, Package, Zap, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';
import img5 from '../assets/images/img5.jpg';
import img6 from '../assets/images/img6.jpg';
import img7 from '../assets/images/img7.jpg';
import img8 from '../assets/images/img8.jpg';
import img9 from '../assets/images/img9.jpg';
import img10 from '../assets/images/img10.jpg';
import img11 from '../assets/images/img11.jpg';

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["ELECTRONICS", "APPAREL", "OFFICE", "HARDWARE", "FOOD"];

  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521334885634-9552f321f9bc?q=80&w=2070&auto=format&fit=crop"
  ];

  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    
    const galleryTimer = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    const heroTimer = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(galleryTimer);
      clearInterval(heroTimer);
    };
  }, []);

  return (
    <div className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-white">
        <AnimatePresence>
          <motion.div
            key={heroImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={heroImages[heroImageIndex]} 
              alt="Slideshow" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 text-white rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/40 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <Shield size={14} className="animate-pulse" /> Uganda's Elite Security Carrier
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              FLASHPOINT <span className="text-brand-yellow">DELIVERIES</span>
            </h1>
            <div className="h-12 md:h-16 relative overflow-hidden mb-12">
              <p className="text-xl md:text-2xl text-white font-medium flex items-center gap-3">
                WE SECURELY TRANSPORT 
                <span className="relative inline-block w-48 text-brand-yellow font-black italic">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="absolute left-0"
                    >
                      {words[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/portal" 
                className="px-10 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center gap-3 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                Send Package <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login?role=seller" 
                className="px-10 py-5 bg-brand-black text-white font-black uppercase tracking-wider rounded-2xl border border-white/40 hover:bg-brand-black/90 transition-all flex items-center gap-3 shadow-lg"
              >
                <Store size={18} /> Partner With Us
              </Link>
              <Link 
                to="/track/FP-UG-100200" 
                className="px-10 py-5 bg-white/20 text-white font-black uppercase tracking-wider rounded-2xl hover:bg-white/30 transition-colors backdrop-blur-md border border-white/30 flex items-center gap-3 shadow-lg"
              >
                <Zap size={18} className="text-brand-yellow" /> Track Live
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Moving Security Ticker */}
      <div className="bg-brand-yellow py-3 overflow-hidden border-y border-brand-black/10 relative z-20">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield size={12} /> SECURE TRANSIT ACTIVE
              </span>
              <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={12} /> ALL DISTRICTS ONLINE
              </span>
              <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={12} /> REAL-TIME MONITORING ENABLED
              </span>
              <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Package size={12} /> ELITE FLEET DEPLOYED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="relative py-24 bg-brand-black-light border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Districts Covered", value: "135+" },
              { label: "Deliveries Monthly", value: "50k+" },
              { label: "Secure Vehicles", value: "200+" },
              { label: "Success Rate", value: "99.9%" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <h3 className="text-4xl font-black text-brand-yellow mb-2 tracking-tighter group-hover:scale-110 transition-transform cursor-default">{stat.value}</h3>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Item Showcase Section */}
      <section className="py-32 bg-brand-black relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
              Elite <span className="text-brand-yellow">Manifest</span>
            </h2>
            <p className="text-slate-500 text-lg uppercase tracking-widest font-black">Secure transit for specialized categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop" },
              { name: "Apparel", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" },
              { name: "Home & Life", img: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=2070&auto=format&fit=crop" },
              { name: "Food Items", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" },
              { name: "Office Kit", img: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop" },
              { name: "Hardware", img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?q=80&w=2070&auto=format&fit=crop" }
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-8 h-8 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-black mb-3 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                    <Package size={16} />
                  </div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">{cat.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Logistics Gallery - White Background Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            {/* Left Column: Slideshow */}
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-brand-yellow/10 text-brand-black border border-brand-yellow/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  The Elite Fleet
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-brand-black tracking-tighter uppercase italic leading-[0.85]">
                  White Glove <span className="text-brand-yellow">Precision</span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-xl">
                  Every package is treated as a high-security asset. Our handlers are trained in elite transit protocols for sensitive, high-value, and specialized cargo configurations within Uganda.
                </p>
              </div>

              {/* Dynamic Slideshow */}
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={galleryIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={galleryImages[galleryIndex]} 
                      alt="Elite Logistics Showcase" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </motion.div>
                </AnimatePresence>
                
                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {galleryImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === galleryIndex ? 'bg-brand-yellow w-12' : 'bg-white/40 w-4'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Grid */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6 md:gap-8">
              {[
                "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1512418490979-92798ccc13fb?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1491633589136-9ad316758a49?q=80&w=2071&auto=format&fit=crop"
              ].map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="aspect-square rounded-[2rem] overflow-hidden shadow-lg border border-slate-50 group hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={img} 
                    alt="Cargo Item" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-32 bg-brand-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065&auto=format&fit=crop" 
            alt="Delivery network" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">ELITE <span className="text-brand-yellow">PRICING</span></h2>
              <p className="text-slate-400 text-lg font-medium">Competitive rates for premium security logistics. Transparent, reliable, and secure.</p>
            </div>
            <Link to="/pricing" className="text-brand-yellow font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:gap-5 transition-all group">
              Full Rate Card <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { type: "Standard Delivery", price: "UGX 5,000", time: "24-48 Hours", features: ["Within Kampala", "Up to 2kg", "Basic Tracking"] },
              { type: "Express Secure", price: "UGX 15,000", time: "Same Day", features: ["Priority Handling", "Up to 5kg", "Real-time Chat"] },
              { type: "Nationwide Cargo", price: "UGX 45,000", time: "2-3 Days", features: ["Anywhere in Uganda", "Up to 20kg", "Insurance Included"] }
            ].map((plan, i) => (
              <div key={i} className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-yellow/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{plan.type}</h3>
                <div className="text-4xl font-black text-brand-yellow mb-6 tracking-tighter">{plan.price}</div>
                <div className="flex items-center gap-3 text-slate-400 text-sm mb-8 font-bold">
                  <Clock size={18} className="text-brand-yellow" /> {plan.time}
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                      <Shield size={16} className="text-brand-yellow" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest text-xs rounded-2xl group-hover:bg-brand-yellow group-hover:text-brand-black transition-all border border-white/5">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-brand-black-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" 
            alt="Security background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-12 leading-[0.9] tracking-tighter">
                SECURITY IS OUR <span className="text-brand-yellow">DNA</span>
              </h2>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
                className="space-y-12"
              >
                {[
                  { icon: <Shield className="text-brand-black" />, title: "Security Escort", desc: "For high-value items, we provide dedicated security personnel to ensure safe passage." },
                  { icon: <MapPin className="text-brand-black" />, title: "Precise Geolocation", desc: "Know exactly where your package is with our GPS-enabled fleet tracking system." },
                  { icon: <Phone className="text-brand-black" />, title: "Direct Communication", desc: "Chat directly with your delivery handler for real-time updates and instructions." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex gap-8 group"
                  >
                    <div className="w-16 h-16 bg-brand-yellow rounded-3xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute -inset-6 bg-brand-yellow/10 rounded-[3rem] rotate-3 blur-2xl"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
                  alt="Delivery truck" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
