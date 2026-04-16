import React from 'react';
import { motion } from 'motion/react';
import { Truck, Shield, Clock, ArrowRight, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics in Uganda" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/80 to-brand-black"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 text-brand-yellow rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-brand-yellow/20 backdrop-blur-sm">
              <Shield size={14} /> Uganda's Elite Security Carrier
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              FLASHPOINT <span className="text-brand-yellow">DELIVERY</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
              Secure, rapid, and reliable delivery services across Uganda. We ensure your high-value packages arrive with absolute safety.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/portal" 
                className="px-10 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] flex items-center gap-3"
              >
                Send Package <ArrowRight size={20} />
              </Link>
              <Link 
                to="/track/FP-UG-100200" 
                className="px-10 py-5 bg-white/5 text-white font-black uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10"
              >
                Track Live
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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
                <h3 className="text-4xl font-black text-brand-yellow mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</h3>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
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
              <div className="space-y-12">
                {[
                  { icon: <Shield className="text-brand-black" />, title: "Security Escort", desc: "For high-value items, we provide dedicated security personnel to ensure safe passage." },
                  { icon: <MapPin className="text-brand-black" />, title: "Precise Geolocation", desc: "Know exactly where your package is with our GPS-enabled fleet tracking system." },
                  { icon: <Phone className="text-brand-black" />, title: "Direct Communication", desc: "Chat directly with your delivery handler for real-time updates and instructions." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 bg-brand-yellow rounded-3xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.2)] group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
